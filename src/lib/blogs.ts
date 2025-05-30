import { languageTag } from '$lib/paraglide/runtime';
import matter from 'gray-matter';

export interface BlogMeta {
  slug: string;
  title: string;
  date: Date;
  tags: string[];
	draft: boolean;
}

const supportedLanguages = ['en', 'zh-cn'];

const blogs = new Map<string, BlogMeta[]>();
const tagToBlogs = new Map<string, Map<string, BlogMeta[]>>();
export const slugs: string[] = [];

const blogsRaw = new Map([
  ['zh-cn', import.meta.glob('/content/zh-cn/*.md', { eager: true, query: 'raw' })],
  ['en', import.meta.glob('/content/en/*.md', { eager: true, query: 'raw' })],
]);

function loadAllBlogs() {
  console.log('Loading all posts');
  for (const lang of supportedLanguages) {
    const files = blogsRaw.get(lang);
    let temp: BlogMeta[] = [];
    for (const [filepath, file] of Object.entries(files || {})) {
      try {
				console.log(`Processing ${filepath}`);
        const metadata = matter(file.default);
        const slug = filepath.split('/').pop()?.replace(/\.md$/, '') || '';
        if (!slug) continue;

        const date = new Date(metadata.data.date);
        if (isNaN(date.getTime())) {
          console.warn(`Invalid date in ${filepath}`);
          continue;
        }

        if (lang === 'en') {
          slugs.push(`blog/${slug}`);
        } else {
          slugs.push(`${lang}/blog/${slug}`);
        }

        temp.push({
          slug,
          date: date,
          title: metadata.data.title || 'Untitled',
          tags: metadata.data.tags.map((t)=>t.toLowerCase()) || [],
          draft: metadata.data.draft || false,
        });
      } catch (error) {
        console.error(`Error processing ${filepath}:`, error);
        continue;
      }
    }

    temp = temp.filter((blog) => !blog.draft);
    temp.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    temp.forEach((blog) => {
      blog.tags.forEach((tag) => {
        if (!tagToBlogs.has(lang)) {
          tagToBlogs.set(lang, new Map<string, BlogMeta[]>());
        }
        const langTaggedBlogs = tagToBlogs.get(lang)!;
        if (!langTaggedBlogs.has(tag)) {
          langTaggedBlogs.set(tag, []);
        }
        langTaggedBlogs.get(tag)!.push(blog);
      });
    });

    blogs.set(lang, temp);
  }
}

loadAllBlogs();

export function getAllBlogsMeta(): BlogMeta[] | undefined {
  return blogs.get(languageTag());
}

export function getTaggedBlogsMeta(tag: string): BlogMeta[] | undefined {
  return tagToBlogs.get(languageTag())?.get(tag);
}
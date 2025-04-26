import { languageTag } from '$lib/paraglide/runtime';
import matter from 'gray-matter';

export interface BlogMeta {
	slug: string;
	title: string;
	date: Date;
	tags: string[];
}

const supportedLanguages = ['en', 'zh-cn', 'zh-tw'];

const blogs = new Map<string, BlogMeta[]>();
const tagToBlogs = new Map<string, Map<string, BlogMeta[]>>();
export const slugs:string[]=[]

const blogsRaw = new Map(
	[
		['zh-cn', import.meta.glob('/content/zh-cn/*.md', {
			eager: true,
			query: 'raw'
		})],
		['zh-tw', import.meta.glob('/content/zh-tw/*.md', {
			eager: true,
			query: 'raw'
		})], [
		'en', import.meta.glob('/content/en/*.md', {
			eager: true,
			query: 'raw'
		})
	]
	]
);



function loadAllBlogs() {
	console.log('loading all posts');
	for (const lang of supportedLanguages) {
		const files=blogsRaw.get(lang)
		let temp=[]
		for (const [filepath, file] of Object.entries(files)) {
			const metadata=matter(file.default)
			const slug= filepath.split('/').pop().replace(/\.md$/, '')
			if(lang==='en'){
				slugs.push(`blog/${slug}`)
			}else{
				slugs.push(`${lang}/blog/${slug}`)
			}
			temp.push({
				slug:slug,
				date: metadata.data.date,
				title: metadata.data.title,
				tags: metadata.data.tags,
				draft: metadata.data.draft
			})
		}
		temp=temp.filter((blog)=>!blog.draft)
		// console.log(temp)
		temp.sort((a, b) => b.date.getTime() - a.date.getTime());
		temp.forEach((blog) => {
			blog.tags.forEach((tag) => {
				if (!tagToBlogs.has(lang)) {
					tagToBlogs.set(lang, new Map<string, BlogMeta[]>());
				}
				const langTaggedBlogs = tagToBlogs.get(lang)!;
				if (!langTaggedBlogs!.has(tag)) {
					langTaggedBlogs.set(tag, []);
				}
				langTaggedBlogs.get(tag)!.push(blog);
			});
		});
		blogs.set(lang, temp);
	}
}

loadAllBlogs();

export function getAllBlogsMeta() {
	return blogs.get(languageTag());
}

export function getTaggedBlogsMeta(tag: string) {
	return tagToBlogs.get(languageTag())!.get(tag);
}


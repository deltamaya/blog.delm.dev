import matter from 'gray-matter';

const site = 'https://blog.delm.dev'; // change this to reflect your domain



const cnBlogs = import.meta.glob('/content/zh-cn/*.md', {
	eager: true,
	query:'raw'
});

const twBlogs = import.meta.glob('/content/zh-tw/*.md', {
	eager: true,
	query:'raw'
});

const enBlogs = import.meta.glob('/content/en/*.md', {
	eager: true,
	query:'raw'
});
const i18nMap = {};

function isDraft(blogPath){
	const content = blogPath.default;
	const { data } = matter(content);
	return data.draft;
}

// Process English files
for (const filePath in enBlogs) {
	if(isDraft(enBlogs[filePath])) continue;
  const fileName = filePath.split('/').pop()?.replace('.md','');
  if (fileName) {
    i18nMap[`blog/${fileName}`] = filePath;
  }
}

// Process Chinese files
for (const filePath in cnBlogs) {
	if(isDraft(cnBlogs[filePath])) continue;
  const fileName = filePath.split('/').pop()?.replace('.md','');
  if (fileName) {
    i18nMap[`zh-cn/blog/${fileName}`] = filePath;
  }
}
// Process Chinese files
for (const filePath in twBlogs) {
	if(isDraft(twBlogs[filePath])) continue;
  const fileName = filePath.split('/').pop()?.replace('.md','');
  if (fileName) {
    i18nMap[`zh-tw/blog/${fileName}`] = filePath;
  }
}


console.log(i18nMap);

// We just want the directories
const slugArray = Object.keys(i18nMap); // List of posts as an absolute directory (e.g. '/src/posts/drizzle-sveltekit-integration.md')

console.log(slugArray)
const sitemap = (pages: string[]) => `<?xml version="1.0" encoding="UTF-8" ?>
<urlset
  xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xhtml="https://www.w3.org/1999/xhtml"
  xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
>
  ${pages
	.map(
		(page) => `
  <url>
    <loc>${site}/${page}</loc>
    <changefreq>daily</changefreq>
    <priority>0.5</priority>
  </url>
  `
	)
	.join('')}
</urlset>`;


/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
	const body = sitemap(slugArray);
	const response = new Response(body);
	response.headers.set('Cache-Control', 'max-age=0, s-maxage=3600');
	response.headers.set('Content-Type', 'application/xml');
	return response;
}
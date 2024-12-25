const site = 'https://blog.dev.dev'; // change this to reflect your domain



const posts = import.meta.glob('/content/zh-cn/*.md', {
	eager: false
});

// We just want the directories
const directoryArray = Object.keys(posts); // List of posts as an absolute directory (e.g. '/src/posts/drizzle-sveltekit-integration.md')

// Trim the directories so that you have just the slugs
const slugArray = directoryArray.map((post) => post.split('/').at(-1)?.replace('.md', '')); // List of posts as a slug (e.g. 'drizzle-sveltekit-integration')
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
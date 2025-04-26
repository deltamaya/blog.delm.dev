import { languageTag } from '$lib/paraglide/runtime';
import { getAllBlogsMeta } from '$lib/blogs';

const blogs=getAllBlogsMeta().slice(0,10)


function generateRSS(blogs: any) {
	return `<?xml version="1.0" encoding="UTF-8"?>
	 <rss version="2.0">
      <channel>
        <title>DELM blog</title>
        <link>https://blog.delm.dev</link>
        <description>deltamaya blog project, shares my insights on programming, technology and life</description>
        ${blogs.map((blog)=>{
			return `
	<item>
		<title>${blog.title}</title>
		<link>https://blog.delm.dev${languageTag()==='en'?'':'/'+languageTag()}/blog/${blog.slug}</link>
		<description>${blog.title}</description>
		<pubDate>${blog.date}</pubDate>
	</item>
			`
				}
	).join('')}
      </channel>
    </rss>`
	}

export async function GET(){
const body = generateRSS(blogs);
	const response = new Response(body);
	response.headers.set('Content-Type', 'application/rss+xml');
	return response;
}
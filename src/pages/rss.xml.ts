import type { APIRoute } from 'astro';
import { getAllBlogsMeta } from '../lib/blogs';

function escapeXML(str: string): string {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

export const GET: APIRoute = () => {
    const blogs = getAllBlogsMeta().slice(0, 20);
    const items = blogs.map((blog) => {
        const link = `https://blog.delm.dev/blog/${blog.slug}`;
        return `<item><title>${escapeXML(blog.title)}</title><link>${link}</link><description>${escapeXML(blog.title)}</description><pubDate>${blog.date.toUTCString()}</pubDate><guid>${link}</guid></item>`;
    }).join('');

    const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>DELM blog</title><link>https://blog.delm.dev</link><description>deltamaya blog project, shares my insights on programming, technology and life</description><language>en</language>${items}</channel></rss>`;

    return new Response(body, {
        headers: { 'Content-Type': 'application/rss+xml; charset=UTF-8' },
    });
};

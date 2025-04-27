import { languageTag } from '$lib/paraglide/runtime';
import { getAllBlogsMeta } from '$lib/blogs';
export const prerender = true;

// Function to escape only XML special characters, preserving non-ASCII characters
function escapeXML(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateRSS(blogs: any) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>DELM blog</title>
    <link>https://blog.delm.dev</link>
    <description>deltamaya blog project, shares my insights on programming, technology and life</description>
    ${blogs
      .map((blog: any) => {
        // Use blog.date directly (assumes RFC-822 string from BlogMeta)
        const pubDate = blog.date.toLocaleDateString(languageTag())
        return `
    <item>
      <title>${escapeXML(blog.title)}</title>
      <link>https://blog.delm.dev${languageTag() === 'en' ? '' : '/' + languageTag()}/blog/${blog.slug}</link>
      <description>${escapeXML(blog.title)}</description>
      <pubDate>${pubDate}</pubDate>
    </item>
        `;
      })
      .join('')}
  </channel>
</rss>`;
}

export async function GET() {
  try {
    const blogs = getAllBlogsMeta()?.slice(0, 10) || [];
    if (!blogs.length) {
      return new Response('No blogs available', {
        status: 404,
        headers: { 'Content-Type': 'text/plain' },
      });
    }
    const body = generateRSS(blogs);
    return new Response(body, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=UTF-8',
      },
    });
  } catch (error) {
    console.error('Error generating RSS feed:', error);
    return new Response('Internal Server Error', {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
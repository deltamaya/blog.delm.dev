import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export interface BlogMeta {
    slug: string;
    title: string;
    date: Date;
    tags: string[];
    draft: boolean;
    authors: string[];
    ai?: boolean;
}

// Cache
let blogsCache: BlogMeta[] | null = null;
let tagCache: Map<string, BlogMeta[]> | null = null;

function loadBlogs(): BlogMeta[] {
    if (blogsCache) return blogsCache;

    const dir = path.resolve('content');
    if (!fs.existsSync(dir)) return [];

    const files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
    const results: BlogMeta[] = [];

    for (const file of files) {
        try {
            const filePath = path.join(dir, file);
            const raw = fs.readFileSync(filePath, 'utf-8');
            const { data } = matter(raw);
            const slug = file.replace(/\.md$/, '');

            const date = new Date(data.date);
            if (isNaN(date.getTime())) continue;
            if (data.draft) continue;

            results.push({
                slug,
                title: data.title || 'Untitled',
                date,
                tags: (data.tags ?? []).map((t: string) => t.toLowerCase()),
                draft: data.draft ?? false,
                authors: data.authors ?? [],
                ai: data.ai ?? false,
            });
        } catch {
            // skip malformed files
        }
    }

    results.sort((a, b) => b.date.getTime() - a.date.getTime());
    blogsCache = results;
    return results;
}

function loadTagMap(): Map<string, BlogMeta[]> {
    if (tagCache) return tagCache;

    const blogs = loadBlogs();
    const map = new Map<string, BlogMeta[]>();

    for (const blog of blogs) {
        for (const tag of blog.tags) {
            if (!map.has(tag)) map.set(tag, []);
            map.get(tag)!.push(blog);
        }
    }

    tagCache = map;
    return map;
}

export function getAllBlogsMeta(): BlogMeta[] {
    return loadBlogs();
}

export function getTaggedBlogsMeta(tag: string): BlogMeta[] {
    return loadTagMap().get(tag) ?? [];
}

export function getTagCounts(): [string, number][] {
    const map = loadTagMap();
    return Array.from(map.entries())
        .map(([tag, blogs]) => [tag, blogs.length] as [string, number])
        .sort((a, b) => b[1] - a[1]);
}

export function getAllTags(): string[] {
    return Array.from(loadTagMap().keys());
}

export function getAllSlugs(): string[] {
    return loadBlogs().map((b) => b.slug);
}

export function getAllYears(): number[] {
    const blogs = loadBlogs();
    const years = new Set(blogs.map((b) => b.date.getFullYear()));
    return Array.from(years).sort((a, b) => b - a);
}

export function getBlogsByYear(year: number): Map<string, BlogMeta[]> {
    const blogs = loadBlogs().filter((b) => b.date.getFullYear() === year);
    const grouped = new Map<string, BlogMeta[]>();

    for (const blog of blogs) {
        const month = blog.date.toLocaleString('en', { month: 'long' });
        if (!grouped.has(month)) grouped.set(month, []);
        grouped.get(month)!.push(blog);
    }

    return grouped;
}

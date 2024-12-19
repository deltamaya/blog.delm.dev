import path from 'path';
import { languageTag } from '$lib/paraglide/runtime';
import fs from 'fs';
import matter from 'gray-matter';

export interface BlogMeta {
	slug: string;
	title: string;
	date: Date;
	tags: string[]; // 博客包含的标签
}

// 定义全局数据存储
let blogs: BlogMeta[] = []; // 存储所有博客
const tagToBlogs: Map<string, BlogMeta[]> = new Map(); // tag -> blogs 的映射

function loadAllBlogs() {
	console.log('loading all posts');
	const postsDirectory = path.resolve(`content/${languageTag()}`);
	const files = fs.readdirSync(postsDirectory);

	blogs = files.map((file) => {
		const filePath = path.join(postsDirectory, file);
		const content = fs.readFileSync(filePath, 'utf-8');
		const { data } = matter(content);
		return {
			slug: file.replace(/\.md$/, ''),
			date: data.date,
			title: data.title,
			tags: data.tags
		};
	});
	blogs.sort((a, b) => b.date.getTime() - a.date.getTime());
	blogs.forEach((blog) => {
		blog.tags.forEach((tag) => {
			if (!tagToBlogs.has(tag)) {
				tagToBlogs.set(tag, []);
			}
			tagToBlogs.get(tag)!.push(blog);
		});
	});
}

loadAllBlogs();

export function getAllBlogsMeta() {
	return blogs;
}

export function getTaggedBlogsMeta(tag: string) {
	return tagToBlogs.get(tag);
}

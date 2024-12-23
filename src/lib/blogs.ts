import path from 'path';
import { languageTag } from '$lib/paraglide/runtime';
import fs from 'fs';
import matter from 'gray-matter';

export interface BlogMeta {
	slug: string;
	title: string;
	date: Date;
	tags: string[];
}

const supportedLanguages = ['en', 'zh-cn', 'zh-tw'];


const blogs = new Map<string, BlogMeta[]>(); // 存储所有博客
const tagToBlogs = new Map<string, Map<string, BlogMeta[]>>(); // tag -> blogs 的映射

function loadAllBlogs() {
	console.log('loading all posts');
	for (const lang of supportedLanguages) {
		console.log(lang);
		const postsDirectory = path.resolve(`content/${lang}`);
		const files = fs.readdirSync(postsDirectory);
		const temp = files.map((file) => {
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

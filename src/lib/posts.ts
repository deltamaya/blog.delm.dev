import path from 'path';
import { languageTag } from '$lib/paraglide/runtime';
import fs from 'fs';
import matter from 'gray-matter';

export function getAllPosts() {
	const postsDirectory = path.resolve(`content/${languageTag()}`);
	const files = fs.readdirSync(postsDirectory);

	return files.map((file) => {
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
}
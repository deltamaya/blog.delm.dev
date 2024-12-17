import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { languageTag } from '$lib/paraglide/runtime.js';

export function load() {
	const postsDirectory = path.resolve(`content/${languageTag()}`);
	const files = fs.readdirSync(postsDirectory);

	const posts = files.map((file) => {
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

	const groupedPosts = new Map();

	posts.forEach((post) => {
		const year = post.date.getFullYear();
		const month = post.date.toLocaleString(languageTag(), { month: 'long' });

		if (!groupedPosts.has(year)) {
			groupedPosts.set(year, new Map());
		}

		const monthsMap = groupedPosts.get(year);

		if (!monthsMap.has(month)) {
			monthsMap.set(month, []);
		}

		monthsMap.get(month).push(post);
	});

	return {groupedPosts}
}

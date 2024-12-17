import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { languageTag } from '$lib/paraglide/runtime.js';
import { getAllPosts } from '$lib/posts';

export function load() {

	const posts=getAllPosts();

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

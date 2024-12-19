import { languageTag } from '$lib/paraglide/runtime.js';
import { getAllBlogsMeta } from '$lib/blogs';

export function load() {
	const posts = getAllBlogsMeta();

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

	return { groupedPosts };
}

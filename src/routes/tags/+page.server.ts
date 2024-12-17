import {  getAllBlogsMeta } from '$lib/blogs';

export function load() {
	const posts = getAllBlogsMeta();

	const tagMap = new Map<string, number>();
	posts.forEach((post) => {
		post.tags.forEach((tag: string) => {
			const upper = tag.toUpperCase();
			if (!tagMap.has(upper)) {
				tagMap.set(upper, 1);
			}else{
				tagMap.set(upper,tagMap.get(upper)!+1)
			}
		});
	});
	const tagCounts=Array.from(tagMap.entries())
	tagCounts.sort((a, b) => a[0].localeCompare(b[0]));
	return { tagCounts };
}

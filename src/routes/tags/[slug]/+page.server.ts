
import {getTaggedBlogsMeta} from '$lib/blogs'

export function load({ params }) {
	const { slug } = params;
	console.log(slug)
	return {
		blogs:getTaggedBlogsMeta(slug)
	};
}
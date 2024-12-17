
import {getTaggedBlogsMeta} from '$lib/blogs'

export function load({ params }) {
	const { slug } = params;
	return {
		blogs:getTaggedBlogsMeta(slug),
		tag:slug
	};
}
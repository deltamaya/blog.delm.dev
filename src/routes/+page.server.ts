import {getAllBlogsMeta} from '$lib/blogs'

export function load() {
	return {
		blogs:getAllBlogsMeta()
	}
}
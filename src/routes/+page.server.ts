import {getAllBlogsMeta} from '$lib/blogs'
export function load() {

	return {
		blogs:getAllBlogsMeta().slice(0,7)
	}
}
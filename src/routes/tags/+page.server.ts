import { getAllPosts } from '$lib/posts';

export function load(){
	const posts=getAllPosts();
 // 动态统计标签
  const tagCounts = posts.reduce((acc, post) => {
    post.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});
	return{tagCounts}
}
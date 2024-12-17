<script>
	import { languageTag } from '$lib/paraglide/runtime.js';

	let { posts, month } = $props();
	const total = posts.length;
</script>

<div class="flex flex-wrap">
	<div class="w-32 flex mt-3">
		<div class="font-bold text-lg">
			{month}
		</div>
		<div class="font-bold text-sm text-neutral-500 ml-1">
			{total}
		</div>
	</div>
	<div class="flex flex-col">
		{#each posts as post,index}
			<div class="flex my-3 ml-5">
				<div class="flex flex-col">
					<a class="text-xl font-bold" href={`/blog/${post.slug}`} >
						{post.title}
					</a>
					<div class="text-sm text-red-500 font-bold flex flex-wrap">
						{#each post.tags as tag}
							<a href="/tags/{tag.toLowerCase()}" class="mr-3">#{tag.toUpperCase()}</a>
						{/each}
					</div>
					<div class="text-sm text-neutral-500 flex flex-wrap">
						{post.date.toLocaleDateString(languageTag())}
					</div>
				</div>
			</div>
		{/each}
	</div>

</div>

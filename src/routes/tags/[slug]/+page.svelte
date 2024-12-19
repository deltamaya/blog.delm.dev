<script>
	import * as m from '$lib/paraglide/messages.js';

	import BlogCard from '../../BlogCard.svelte';

	let { data } = $props();
</script>

<div class="flex h-full w-full flex-col items-center">
	<div class="h-full w-full max-w-[48rem] p-4">
		<div class="flex py-6 text-4xl font-bold">
			<p class="text-4xl font-bold text-red-500">#{data.tag}</p>
			&nbsp;{m.Blogs()}
		</div>

		<div class="flex flex-col">
			{#each data.blogs as blog, index}
				<BlogCard {blog} />
			{/each}
		</div>
	</div>
</div>

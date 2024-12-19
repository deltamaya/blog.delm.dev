<script>
	import BlogCard from '../BlogCard.svelte';

	let { blogs, month } = $props();
	const total = blogs.length;
</script>

<div class="flex flex-wrap">
	<div class="mt-3 flex w-32">
		<div class="text-lg font-bold">
			{month}
		</div>
		<div class="ml-1 text-sm font-bold text-neutral-500">
			{total}
		</div>
	</div>
	<div class="flex flex-col">
		{#each blogs as blog, index}
			<BlogCard {blog} />
		{/each}
	</div>
</div>

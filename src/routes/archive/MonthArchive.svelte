<script>
	import BlogCard from '../BlogCard.svelte';

	let { blogs, month } = $props();
	const total = blogs.length;
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
		{#each blogs as blog,index}
			<BlogCard {blog}/>
		{/each}
	</div>

</div>

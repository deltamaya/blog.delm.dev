<script>
	import BlogCard from '../BlogCard.svelte';

	let { blogs, month } = $props();
	const total = blogs.length;

	let mobileLayout = $state(false);

	function handleResize() {
		mobileLayout = window.innerWidth < 768;
	}
	$effect(() => {
		window.addEventListener('resize', handleResize);
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<div class="flex" class:flex-col={mobileLayout}>
	<div class="mt-3 flex w-32">
		<div class="text-lg font-bold">
			{month}
		</div>
		<div class="ml-1 text-sm font-bold text-neutral-500">
			{total}
		</div>
	</div>
	<div class="flex flex-col">
		{#each blogs as blog}
			<BlogCard {blog} />
		{/each}
	</div>
</div>

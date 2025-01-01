<script>
	import * as m from '$lib/paraglide/messages.js';

	import BlogCard from '../../BlogCard.svelte';

	let { data } = $props();
</script>
<svelte:head>
	<title>#{data.tag.toUpperCase()} - DELM</title>
</svelte:head>
<div class="flex h-full w-full flex-col items-center">
	<div class="h-full w-full max-w-[48rem] p-4">
		<div class="flex py-6 text-4xl font-bold">
			#{data.tag.toUpperCase()}
		</div>

		<div class="flex flex-col">
			{#each data.blogs as blog, index}
				<BlogCard {blog} />
			{/each}
		</div>
	</div>
</div>

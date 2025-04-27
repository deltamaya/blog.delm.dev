<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import BlogCard from './BlogCard.svelte';
	import Icon from '@iconify/svelte';

	let { data } = $props();
</script>
<svelte:head>
	<title>DELM Blog Site</title>
</svelte:head>
<div class="flex flex-grow flex-col items-center justify-center">
	<div class="h-full w-full max-w-[48rem] p-4">
		<div class="py-6 text-2xl font-bold">
			{m.Welcome()}
		</div>
		<div class="py-6 text-4xl font-bold flex">
			{m.Latest()}
			<a href="/rss" class="hover:text-red-600">
<Icon icon="mdi:rss" width="30" height="30" />
			</a>
		</div>
		<div class="flex flex-col space-y-2">
			{#each data.blogs as blog}
				<BlogCard {blog} />
			{/each}
		</div>
	</div>
</div>

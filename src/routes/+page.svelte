<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import BlogCard from './BlogCard.svelte';

	let { data } = $props();
</script>

<div class="flex-grow flex justify-center items-center p-4">
	<div class="h-full w-full max-w-[48rem]">
		<div class="text-2xl font-bold py-6">
			{m.Welcome()}
		</div>
		<div class="text-4xl font-bold py-6">
			{m.Latest()}
		</div>
		<div class="flex flex-col">
			{#each data.blogs as blog}
				<BlogCard {blog} />
			{/each}
		</div>
	</div>
</div>
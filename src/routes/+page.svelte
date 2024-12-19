<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import BlogCard from './BlogCard.svelte';

	let { data } = $props();
</script>

<div class="flex flex-grow flex-col items-center justify-center">
	<div class="h-full w-full max-w-[48rem] p-4">
		<div class="py-6 text-2xl font-bold">
			{m.Welcome()}
		</div>
		<div class="py-6 text-4xl font-bold">
			{m.Latest()}
		</div>
		<div class="flex flex-col">
			{#each data.blogs as blog}
				<BlogCard {blog} />
			{/each}
		</div>
	</div>
</div>

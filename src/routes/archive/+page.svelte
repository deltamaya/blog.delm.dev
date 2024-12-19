<script>
	import * as m from '$lib/paraglide/messages.js';
	import YearArchive from './YearArchive.svelte';
	import BlogCard from '../BlogCard.svelte';

	let { data } = $props();
</script>

<div class="flex flex-grow flex-col items-center">
	<div class="h-full w-full max-w-[48rem] p-4">
		<div class="py-6 text-4xl font-bold">
			{m.Archive()}
		</div>
		<div class="space-y-5">
			{#each data.groupedPosts as kv, index}
				<YearArchive year={kv[0]} months={kv[1]} />
				{#if index !== data.groupedPosts.size - 1}
					<hr />
				{/if}
			{/each}
		</div>
	</div>
</div>

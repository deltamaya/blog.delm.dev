<script>
	import * as m from '$lib/paraglide/messages.js';
	import YearArchive from './YearArchive.svelte';

	let { data } = $props();
</script>

<div class="flex flex-col items-center w-full h-full">
	<div class="h-full w-full max-w-[48rem] p-4">
		<div class="text-4xl font-bold py-6">
			Archive
		</div>

		<div class="space-y-5">
			{#each data.groupedPosts as kv,index}
				<YearArchive year={kv[0]} months={kv[1]} />
				{#if index !== data.groupedPosts.size - 1}
					<hr />
				{/if}
			{/each}

		</div>
	</div>
</div>


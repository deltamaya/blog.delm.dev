<script>
	import * as m from '$lib/paraglide/messages.js';

	let { data } = $props();
</script>

<svelte:head>
	<title>{m.Tags()} - DELM</title>
</svelte:head>
<div class="flex h-full w-full flex-col items-center">
	<div class="h-full w-full max-w-[48rem] p-4">
		<div class="py-6 text-4xl font-bold">
			{m.Tags()}
		</div>

		<div class="flex flex-wrap gap-3 ">

			{#each data.tagCounts as [tag, count]}
				<a href="/tags/{tag.toLowerCase()}"
					 class="hover:underline decoration-red-600 flex justify-between text-xl font-bold rounded  transition-colors duration-300 px-2 py-1 dark:text-neutral-100 ">
					<div class="text-red-600">#</div>
					{tag.toUpperCase()}
					<div class="text-red-600">&nbsp;{count}</div>
				</a>
			{/each}
		</div>
	</div>
</div>

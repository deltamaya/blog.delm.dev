<script>
	import * as m from '$lib/paraglide/messages.js';
	import TagEntry from './TagEntry.svelte';

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
				<TagEntry {tag} {count}/>
			{/each}
		</div>
	</div>
</div>

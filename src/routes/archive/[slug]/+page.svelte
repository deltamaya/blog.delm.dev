<script>
	import * as m from '$lib/paraglide/messages.js';
	import YearArchive from '../YearArchive.svelte';

	let { data } = $props();
	let curYear = $state(new Date().getFullYear());

</script>

<div class="flex flex-grow flex-col items-center">
	<div class="flex h-full w-full max-w-[48rem] flex-col p-4">
		<div class="py-6 text-4xl font-bold">
			{m.Archive()}
		</div>
		{#if data.months}
			<YearArchive year={data.year} months={data.months} />
		{:else}
			<div class="flex-grow text-3xl font-bold">NULL</div>
		{/if}
		<div class="flex w-full items-center justify-between text-xl font-bold text-neutral-900">
			{#if curYear > data.year}
				<a href="/archive/{data.year + 1}"> {m.Prev()} </a>
			{/if}

			<div class="flex-grow"></div>
			{#if data.year > 2023}
				<a href="/archive/{data.year - 1}"> {m.Next()} </a>
			{/if}
		</div>
	</div>
</div>

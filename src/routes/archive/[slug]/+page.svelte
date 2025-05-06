<script>
	import * as m from '$lib/paraglide/messages.js';
	import MonthArchive from '../MonthArchive.svelte';


	let { data } = $props();
	let curYear = $state(new Date().getFullYear());
</script>
<svelte:head>
	<title>Archive {data.year} - DELM</title>
</svelte:head>
<div class="flex flex-grow flex-col items-center">
	<div class="flex h-full w-full max-w-[48rem] flex-col p-4">
		<div class="py-6 text-4xl font-bold">
			{m.Archive()}-{data.year}
		</div>
		{#if data.months}
			<div class="flex flex-col w-full">
				<div class="my-5 flex">
					<div class="text-2xl font-bold">
						{data.year}
					</div>
					<div class="ml-2 text-sm font-bold text-neutral-500">
						{[...data.months.entries()].reduce((sum, entry) => sum + entry[1].length, 0)}
					</div>
				</div>
				{#each data.months as kv}
					<MonthArchive month={kv[0]} blogs={kv[1]} />
				{/each}
			</div>

		{:else}
			<div class="flex-grow text-3xl font-bold">NULL</div>
		{/if}
		<div class="flex w-full items-center justify-between text-xl font-bold text-neutral-900 dark:text-neutral-100">
			{#if curYear > data.year}
				<a href="/archive/{data.year + 1}" class="transition-colors duration-200 flex items-center dark:fill-white dark:hover:fill-red-600 hover:text-red-600 hover:fill-red-600">
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path  d="M15.41 16.58L10.83 12l4.58-4.59L14 6l-6 6l6 6z"/></svg>
					{m.Prev()}
				</a>
			{/if}

			<div class="flex-grow"></div>
			{#if data.year > 2023}
				<a href="/archive/{data.year - 1}" class="transition-colors duration-200 flex items-center dark:fill-white dark:hover:fill-red-600 hover:text-red-600 hover:fill-red-600">
					{m.Next()}
					<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	<path d="M8.59 16.58L13.17 12L8.59 7.41L10 6l6 6l-6 6z" />
</svg>
				</a>
			{/if}
		</div>
	</div>
</div>

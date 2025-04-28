<script>
	import * as m from '$lib/paraglide/messages.js';
	let keyword = $state('');

	function handleSearch() {
		if (keyword.trim()) {
			window.location =`https://www.google.com/search?q=site:blog.delm.dev+${keyword.trim().split(' ').join('+')}`;
		}
	}
</script>

<svelte:head>
	<title>{m.Search()} - DELM</title>
</svelte:head>
<div class="flex h-full w-full flex-col items-center">
	<div class="h-full w-full max-w-[48rem] p-4">
		<div class="py-6 text-4xl font-bold">
			{m.Search()}
		</div>
		<div class="flex flex-col items-center justify-center">
			<input
				type="text"
				bind:value={keyword}
				placeholder={m.SearchHere()}
				onkeydown={(e) => e.key === 'Enter' && handleSearch()}
				class="w-full rounded-sm border-2 border-neutral-200 px-3 py-2 font-bold dark:bg-neutral-800 text-neutral-900 dark:text-white dark:placeholder-neutral-100 "
			/>
			<button
				onclick={handleSearch}
				class="mt-3 flex w-32 items-center justify-center rounded-lg bg-red-500 px-3 py-2 font-bold text-white"
			>
				{m.Search()}
			</button>
		</div>
	</div>
</div>

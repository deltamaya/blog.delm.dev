<script>
	import * as m from '$lib/paraglide/messages.js';
	import Icon from '@iconify/svelte';
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
<div class="flex h-full w-full flex-col items-center transition-colors">
	<div class="h-full w-full max-w-[48rem] p-4">
		<div class="py-6 text-4xl font-bold">
			{m.Search()}
		</div>
		<div class="flex items-center justify-center">
			<input
				type="text"
				bind:value={keyword}
				placeholder={m.SearchHere()}
				onkeydown={(e) => e.key === 'Enter' && handleSearch()}
				class="w-full border-2 border-neutral-200 dark:border-neutral-800 px-3 py-2 font-bold dark:bg-neutral-900 text-neutral-900 dark:text-white dark:placeholder-neutral-200 "
			/>
			<button
				aria-label="search"
				onclick={handleSearch}
				class="flex items-center justify-center px-3 py-2 font-bold hover:text-red-600 transition-colors"
			>
				<Icon icon="material-symbols:search" width="24" height="24" />
			</button>
		</div>
	</div>
</div>

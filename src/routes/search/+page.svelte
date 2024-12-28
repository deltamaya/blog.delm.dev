<script>
	import * as m from '$lib/paraglide/messages.js';
	let keyword = $state('');
</script>

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
				class="w-full rounded-2xl border-2 border-neutral-300 px-3 py-2 font-bold"
			/>
			<button
				onclick={() =>
					(window.location = `https://www.google.com/search?q=site:blog.delm.dev+${keyword.trim().split(' ').join('+')}`)}
				class="mt-3 flex w-32 items-center justify-center rounded-2xl bg-red-500 px-3 py-2 font-bold text-white"
			>
				{m.Search()}
			</button>
		</div>
	</div>
</div>

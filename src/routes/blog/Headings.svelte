<script>
	let { headings } = $props();
	import * as m from '$lib/paraglide/messages.js';

</script>

<nav class="sticky w-64 px-4 my-5 overflow-y-auto break-all
 border-l-2 border-neutral-200"
style="scrollbar-width: none;-ms-overflow-style: none">
	<h2 class="mb-4 text-lg font-bold">{m.TableOfContents()}</h2>
	<div class="flex flex-col flex-wrap">
		{#each headings as heading}
			<a
				href={`#${heading.id}`}
				class="text-neutral-900 hover:text-red-600 hover:underline flex flex-wrap"
				style={`margin-left: ${(heading.depth - 1) * 12}px;font-weight: ${(7 - heading.depth) * 100}`}
			>
				{heading.text}
			</a>
		{/each}
	</div>
</nav>

<style>
	::-webkit-scrollbar {
    display: none;
}
</style>
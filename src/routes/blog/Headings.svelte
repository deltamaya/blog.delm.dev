<script>
	let { headings } = $props();
	import * as m from '$lib/paraglide/messages.js';
</script>

<nav
	class="my-5 w-full border-l-2
 border-neutral-200 px-4"
	style="scrollbar-width: none;-ms-overflow-style: none"
>
	<h2 class="mb-1 text-lg font-bold">{m.TableOfContents()}</h2>
	<div class="flex flex-col flex-wrap">
		{#each headings as heading}
			<a
				href={`#${heading.id}`}
				class="w-full truncate text-neutral-900 hover:text-red-600 hover:underline"
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

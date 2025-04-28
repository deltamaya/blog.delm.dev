<script>
	let { headings } = $props();

	let collapsed=$state(true);
	import * as m from '$lib/paraglide/messages.js';
	import { slide } from 'svelte/transition';
	import { cubicIn, cubicInOut, cubicOut, elasticOut, linear } from 'svelte/easing';
</script>

<nav
	class="my-5 w-full border-l-[1px]
 border-neutral-800 dark:border-neutral-100 px-4"
>
	<div class="flex justify-between">
		<h2 class="mb-1 text-lg font-bold">{m.TableOfContents()}</h2>
		<button onclick={()=>collapsed=!collapsed} aria-label="toggle table of content">

			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class:rotate-180={!collapsed} class="stroke-neutral-900  fill-neutral-900 dark:fill-white dark:stroke-white">
	<path d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z" />
</svg>
		</button>
	</div>
	{#if !collapsed}
	<div class="flex flex-col" transition:slide={{ duration: 300,easing:cubicOut }}>
		{#each headings as heading}
			<a
				href={`#${heading.id}`}
				class="hover:text-red-600 hover:underline flex flex-wrap"
				style={`margin-left: ${(heading.depth - 1) * 12}px;font-weight: ${(7 - heading.depth) * 100}`}
			>
				{heading.text}
			</a>
		{/each}
	</div>
		{/if}
</nav>

<style>

</style>

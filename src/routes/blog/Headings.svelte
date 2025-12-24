<script>
	let { headings } = $props();

	let collapsed = $state(true);
	import * as m from '$lib/paraglide/messages.js';
	import { slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
</script>

<nav
	class="my-5 w-full border-l-[2px]
 border-neutral-800 px-4 dark:border-neutral-100"
>
	<div class="flex justify-between">
		<button
			class="flex w-full justify-between"
			onclick={() => (collapsed = !collapsed)}
			aria-label="toggle table of content"
		>
			<h2 class="mb-1 text-lg font-bold">{m.TableOfContents()}</h2>

			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				class:rotate-180={!collapsed}
				class="fill-neutral-900 stroke-neutral-900 dark:fill-white dark:stroke-white"
			>
				<path d="M7.41 8.58L12 13.17l4.59-4.59L18 10l-6 6l-6-6z" />
			</svg>
		</button>
	</div>
	{#if !collapsed}
		<div class="flex flex-col" transition:slide={{ duration: 300, easing: cubicOut }}>
			{#each headings as heading}
				<div
					class="flex flex-wrap"
					style={`margin-left: ${(heading.depth - 1) * 12}px;font-weight: ${(7 - heading.depth) * 100}`}
				>
					<a class="flex flex-wrap hover:text-red-500 hover:underline" href={`#${heading.id}`}
						>{heading.text}</a
					>
				</div>
			{/each}
		</div>
	{/if}
</nav>

<style>
</style>

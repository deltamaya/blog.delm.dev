<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	let { data } = $props();

	import Headings from '../Headings.svelte';
	import ReturnTopButton from '../ReturnTopButton.svelte';
	import AINotice from '../AINotice.svelte';
	import { languageTag } from '$lib/paraglide/runtime';
	import 'katex/dist/katex.min.css';

	const ReturnButtonThreshold = 300;
	const HeadingMapThreshold = 1420;
	let showReturnButton = $state(false);
	let showHeadingMap = $state(true);

	function handleCopy(event) {
		const button = event.target;
		const codeBlock = button.previousElementSibling;
		const code = codeBlock.textContent;
		navigator.clipboard.writeText(code).then(() => {
			button.textContent = m.Copied();
			button.disabled = true;
			setTimeout(() => {
				button.textContent = m.Copy();
				button.disabled = false;
			}, 3000);
		});
	}

	function handleResize() {
		showHeadingMap = window.innerWidth >= HeadingMapThreshold;
	}

	function handleScroll() {
		showReturnButton = window.scrollY >= ReturnButtonThreshold;
	}

	$effect(() => {
		handleResize();
		handleScroll();
		window.addEventListener('resize', handleResize);
		window.addEventListener('scroll', handleScroll);
		const buttons = document.querySelectorAll('.copy-button');
		buttons.forEach((button) => {
			button.textContent = m.Copy();
			button.addEventListener('click', handleCopy);
		});

		return () => {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<div class="flex w-full flex-col items-center">
	<div class="flex h-full max-w-[48rem] flex-col p-4">
		<h1 class="text-5xl font-bold">
			{data.metadata.title}
		</h1>
		<div class="my-1 text-base text-gray-500">
			{data.metadata.date.toLocaleDateString(languageTag())}
			· {m.AuthoredBy({ authors: data.metadata.authors.join(', ') })}
		</div>
		<div class="flex flex-wrap text-lg font-bold text-red-500">
			{#each data.metadata.tags as tag}
				<a href="/tags/{tag.toLowerCase()}" class="mr-5 hover:underline">#{tag.toUpperCase()}</a>
			{/each}
		</div>
		{#if data.metadata.ai}
			<AINotice />
		{/if}
		<hr class="my-10 h-[2px] bg-neutral-100" />
		<article class="prose prose-base prose-neutral lg:prose-lg">
			{@html data.content}
		</article>
		{#if showHeadingMap}
			<Headings headings={data.headings} />
		{/if}
	</div>

	{#if showReturnButton}
		<ReturnTopButton />
	{/if}
</div>

<style>
	:global(.katex) {
		padding: 5px;
		font-size: 1.2em;
	}
	:global(.katex-display) {
		font-size: 1.2em;
	}
</style>

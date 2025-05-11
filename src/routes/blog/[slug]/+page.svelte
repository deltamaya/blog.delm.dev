<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';
	import { RegisteredAuthors } from '$lib/authors';

	let { data } = $props();

	import Headings from '../Headings.svelte';
	import ReturnTopButton from '../ReturnTopButton.svelte';
	import AINotice from '../AINotice.svelte';
	import { languageTag } from '$lib/paraglide/runtime';
	import 'katex/dist/katex.min.css';

	const ReturnButtonThreshold = 300;
	let showReturnButton = $state(false);

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


	function handleScroll() {
		showReturnButton = window.scrollY >= ReturnButtonThreshold;
	}

	$effect(() => {
		handleScroll();
		window.addEventListener('scroll', handleScroll);
		const buttons = document.querySelectorAll('.copy-button');
		buttons.forEach((button) => {
			button.textContent = m.Copy();
			button.addEventListener('click', handleCopy);
		});

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>
<svelte:head>
	<title>{data.metadata.title} - DELM</title>

</svelte:head>
<div
	class="flex w-full flex-col flex-wrap items-center">
	<div class="flex h-full max-w-[800px] w-full flex-col p-4  dark:text-white">
		<div class="flex flex-wrap">
			<h1 class="text-3xl font-bold lg:text-5xl">
				{data.metadata.title}
			</h1>
			<a
				href="https://github.com/deltamaya/blog.delm.dev/issues/new"
				class="flex text-xs text-gray-500 hover:text-red-500 hover:underline lg:text-sm dark:text-gray-300"
			>
				<svg
					fill="none"
					shape-rendering="geometricPrecision"
					stroke="currentColor"
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2.5"
					viewBox="0 0 24 24"
					height="12"
					width="12"
				>
					<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
					<path d="M15 3h6v6"></path>
					<path d="M10 14L21 3"></path>
				</svg>
				{m.SuggestChanges()}</a
			>
		</div>

		<div class="my-1 flex text-base text-gray-500 dark:text-gray-300">
			{data.metadata.date.toLocaleDateString(languageTag())}
			·
			{ m.AuthoredBy()}&nbsp;
			<div class="flex space-x-2">
				{#each data.metadata.authors as author,index}
					<a href={RegisteredAuthors.get(author)?.url??"#"} class="hover:text-red-500 hover:underline">{author}</a>
					{#if index !== data.metadata.authors.length - 1}
						,
					{/if}
				{/each}
			</div>
		</div>

		<div class="flex flex-wrap text-lg font-bold text-red-500">
			{#each data.metadata.tags as tag}
				<a href="/tags/{tag.toLowerCase()}" class="mr-5 hover:underline">#{tag.toUpperCase()}</a>
			{/each}
		</div>
		{#if data.metadata.ai}
			<AINotice />
		{/if}
		<Headings headings={data.headings} />

		<hr class="my-10 h-[1px] dark:border-neutral-800 transition-colors" />
		<article
			class="
			max-w-[800px] w-full
			prose prose-neutral prose-base lg:prose-lg self-center
			dark:text-white prose-headings:dark:text-white

">
			{@html data.content}
		</article>
	</div>

	{#if showReturnButton}
		<ReturnTopButton />
	{/if}
</div>

<style>

</style>

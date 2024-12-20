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

<div class="flex w-full flex-col items-center flex-wrap overflow-hidden">
	<div class="flex h-full max-w-[48rem] flex-col p-4">
		<div class="flex">
					<h1 class="lg:text-5xl  text-4xl  font-bold">
			{data.metadata.title}

		</h1>
			<a href="https://github.com/deltamaya/blog_site/pulls" class="lg:text-base text-sm flex hover:underline hover:text-red-500 text-gray-500">{m.SuggestChanges()}
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
					</svg></a>
		</div>

		<div class="my-1 text-base text-gray-500 flex">
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
		<article class="prose prose-neutral lg:prose-lg md:prose-base prose-sm self-center">
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
        font-size: 1.2em;
    }

    :global(.katex-display) {
        font-size: 1.2em;
    }
		:global(.katex-html) {
        /*width: 100%;*/
        overflow-wrap: break-word;
        word-break: break-word;
        white-space: normal;
    }

    @media (max-width: 768px) {
        :global(.katex-display) {
            font-size: 1rem;
        }
				:global(.katex) {
            font-size: 1rem;
        }
    }
</style>

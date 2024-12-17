<script lang="ts">
	import * as m from '$lib/paraglide/messages.js';

	let { data } = $props();

	import Headings from '../Headings.svelte';
	import ReturnTopButton from '../ReturnTopButton.svelte';
	import AINotice from '../AINotice.svelte';

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
		buttons.forEach(button => {
			button.textContent = m.Copy();
			if (!button.dataset.bound) {
				button.addEventListener('click', handleCopy);
				button.dataset.bound = true;
			}
		});

		return () => {
			window.removeEventListener('resize', handleResize);
			window.removeEventListener('scroll', handleScroll);
		};
	});
</script>

<div class="flex flex-col items-center w-full">
	<div class="h-full max-w-[48rem] p-4 flex flex-col">
		<h1 class="text-5xl font-bold">
			{data.metadata.title}
		</h1>
		<div class="text-base text-gray-500 my-1">
			{data.metadata.date}
			· {m.AuthoredBy({ authors: data.metadata.authors.join(', ') })}
		</div>
		<div class="text-lg text-red-500 font-bold flex flex-wrap">
			{#each data.metadata.tags as tag}
				<a href="/tags/{tag.toLowerCase()}" class="mr-5 ">#{tag.toUpperCase()}</a>
			{/each}
		</div>
		{#if data.metadata.ai}
			<AINotice/>
		{/if}
		<article class="prose prose-neutral lg:prose-lg prose-base mt-10">
			{@html data.content}
		</article>
		{#if showHeadingMap}
			<Headings headings={data.headings}/>
		{/if}
	</div>

	{#if showReturnButton}
		<ReturnTopButton />
	{/if}
</div>

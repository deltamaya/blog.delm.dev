<script>
	let { blog } = $props();
	import { languageTag } from '$lib/paraglide/runtime.js';
</script>

<div class="flex hover:bg-neutral-100 px-3 py-2 rounded-2xl w-full">
	<div class="flex flex-col">
		<a class="text-xl font-bold" href={`/blog/${blog.slug}`}>
			{blog.title}
			<div class="flex flex-wrap text-sm font-medium text-neutral-500">
				{blog.date.toLocaleDateString(languageTag())}
			</div>
		</a>

		<div class="flex flex-wrap text-sm font-bold text-red-500">
			{#each blog.tags as tag}
				<a href="/tags/{tag.toLowerCase()}" class="mr-3 hover:underline">#{tag.toUpperCase()}</a>
			{/each}
		</div>
	</div>
</div>

<script>
	let { blog } = $props();
	import { languageTag } from '$lib/paraglide/runtime.js';
</script>

<div class="lg:text-xl md:text-lg flex px-3 py-2 transition-colors"  >
	<div class="flex flex-col" >
			<a href={`/blog/${blog.slug}`}>
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

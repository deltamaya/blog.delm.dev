<script>
	let {blog}=$props()
	import { languageTag } from '$lib/paraglide/runtime.js';
</script>

<div class="flex my-3 ml-5">
	<div class="flex flex-col">

		<a class="text-xl font-bold" href={`/blog/${blog.slug}`}>
			{blog.title}
			<div class="text-sm text-neutral-500 flex flex-wrap font-medium">
				{blog.date.toLocaleDateString(languageTag())}
			</div>
		</a>

		<div class="text-sm text-red-500 font-bold flex flex-wrap">
			{#each blog.tags as tag}
				<a href="/tags/{tag.toLowerCase()}" class="mr-3 hover:underline">#{tag.toUpperCase()}</a>
			{/each}
		</div>
	</div>
</div>
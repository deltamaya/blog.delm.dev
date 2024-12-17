<script>
		import * as m from '$lib/paraglide/messages.js';

	import BlogCard from '../../BlogCard.svelte';

	let {data} =$props()
</script>

<div class="flex flex-col items-center w-full h-full">
	<div class="h-full w-full max-w-[48rem] p-4">
		<div class="text-4xl font-bold py-6 flex">
			<p class="text-4xl font-bold text-red-500">#{data.tag}</p>&nbsp;{m.Blogs()}
		</div>

	<div class="flex flex-col">
		{#each data.blogs as blog,index}
			<BlogCard {blog}/>
		{/each}
	</div>
	</div>
</div>

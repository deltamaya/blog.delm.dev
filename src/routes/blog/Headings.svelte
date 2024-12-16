<script>
	let { headings } = $props();
</script>


<nav class="fixed left-5  top-1/4 w-64 bg-stone-300 p-4 rounded-xl">
	<h2 class="text-lg font-bold mb-4">Table of Contents</h2>
	<div class="flex flex-col">
		{#each headings as heading}
			<a href={`#${heading.id}`} class="text-stone-700 hover:text-red-600 hover:underline"
			style={`margin-left: ${(heading.depth-1)* 12}px;font-weight: ${(7-heading.depth)*100}`}
			>
				{heading.text}
			</a>
		{/each}
	</div>
</nav>
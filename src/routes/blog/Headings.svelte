<script>
	let { headings } = $props();
</script>

<nav class="fixed left-5 top-1/2 w-64 -translate-y-1/2 rounded-xl bg-neutral-100 p-4">
	<h2 class="mb-4 text-lg font-bold">Table of Contents</h2>
	<div class="flex flex-col">
		{#each headings as heading}
			<a
				href={`#${heading.id}`}
				class="text-rose hover:text-red-600 hover:underline"
				style={`margin-left: ${(heading.depth - 1) * 12}px;font-weight: ${(7 - heading.depth) * 100}`}
			>
				{heading.text}
			</a>
		{/each}
	</div>
</nav>

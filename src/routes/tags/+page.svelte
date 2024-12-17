<script>

	let { data } = $props();
</script>

<div class="flex flex-col items-center w-full h-full">
	<div class="h-full w-full max-w-[48rem] p-4">
		<div class="text-4xl font-bold py-6">
			Tags
		</div>

		<div class="space-y-5">
			{#each data.tagCounts as [tag, count]}
				<div class="text-xl text-red-500 font-bold flex justify-between">
					<a href="/tags/{tag.toLowerCase()}" class="mr-3 hover:underline">#{tag.toUpperCase()}</a>
				<div class="text-neutral-900">{count}</div>

				</div>
			{/each}
		</div>
	</div>
</div>

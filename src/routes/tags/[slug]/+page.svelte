<script>
	let {data} =$props()
</script>

<div class="flex flex-col items-center w-full h-full">
	<div class="h-full w-full max-w-[48rem] p-4">
		<div class="text-4xl font-bold py-6">
			Tags
		</div>

		<div class="space-y-5">
			{#each data.blogs as blog}
				<div>{blog.title}</div>
				{/each}
		</div>
	</div>
</div>

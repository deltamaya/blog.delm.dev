<script>
	import * as m from '$lib/paraglide/messages.js';

	let { data } = $props();
	let firstLetters=new Map()
</script>

<div class="flex h-full w-full flex-col items-center">
	<div class="h-full w-full max-w-[48rem] p-4">
		<div class="py-6 text-4xl font-bold">
			{m.Tags()}
		</div>

		<div class="flex flex-wrap gap-5 ">

			{#each data.tagCounts as [tag, count]}
				<a href="/tags/{tag.toLowerCase()}" class="hover:underline decoration-red-500 flex justify-between text-xl font-bold bg-neutral-100 px-3 py-2 rounded-xl">
					#<div class="text-red-500 ">{tag.toUpperCase()}</div>
					<div class="text-neutral-900">|{count}</div>
				</a>
			{/each}
		</div>
	</div>
</div>

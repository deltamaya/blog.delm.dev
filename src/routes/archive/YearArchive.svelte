<script lang="ts">
	import MonthArchive from './MonthArchive.svelte';

	let { months, year }: { months: Map<string, Array<any>>; year: number } = $props();
	const total = [...months.entries()].reduce((sum, entry) => sum + entry[1].length, 0);
</script>

<div class="flex flex-col w-full">
	<div class="my-5 flex">
		<div class="text-2xl font-bold">
			{year}
		</div>
		<div class="ml-2 text-sm font-bold text-neutral-500">
			{total}
		</div>
	</div>
	{#each months as kv,index}
		{#if index!==0}
			<div class="h-[1px] bg-neutral-200 my-2"></div>
			{/if}
		<MonthArchive month={kv[0]} blogs={kv[1]} />
	{/each}
</div>

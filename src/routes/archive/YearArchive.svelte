<script lang="ts">
	import MonthArchive from './MonthArchive.svelte';

	let { months, year }:{months:Map<string,Array<any>>,year:number}= $props();
	const total= months.entries().reduce((sum,entry)=>sum+entry[1].length,0)
</script>

<div class="flex flex-col">
	<div class="my-5 flex" >
		<div class="font-bold text-2xl ">
			{year}
		</div>
		<div class="font-bold text-sm text-neutral-500 ml-2">
			{total}
		</div>
	</div>
	{#each months as kv,index}
		<MonthArchive month={kv[0]} posts={kv[1]}/>
	{/each}
</div>
<script>
	import { slide } from 'svelte/transition';

	let { tag, count } = $props();

	let showUnderline = $state(false);
</script>
<div
	onmouseenter={()=>{
		 showUnderline=true;
	 }
    }
	onmouseleave={()=>{
		 showUnderline=false;
	 }}
	class="underline-tag-container"
  role="region"
>
	<a href="/tags/{tag.toLowerCase()}"

		 class="flex justify-between text-xl font-bold transition-colors duration-300 px-2 py-1 dark:text-neutral-100
">
		<div class="flex relative">
			<div class="text-red-600">#</div>
			{tag.toUpperCase()}
			{#if showUnderline}
				<div transition:slide={{axis:'x'}} class="h-[2px] absolute bottom-1 bg-red-600 w-full"></div>
			{/if}
		</div>
		<div class="text-red-600 text-sm">{count}</div>

	</a>
</div>

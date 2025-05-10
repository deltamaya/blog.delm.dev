<script>
	import { slide } from 'svelte/transition';

	let { children } = $props();

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
	class="relative"
	role="region"
>
	{@render children()}
	{#if showUnderline}
		<div transition:slide={{axis:'x'}} class="h-[2px] absolute bottom-1 bg-red-600 w-full"></div>
	{/if}
</div>

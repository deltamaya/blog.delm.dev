<script>
	import Icon from '@iconify/svelte';
	import {fly} from 'svelte/transition'
</script>

<button
	class="fixed bottom-10 right-5 flex items-center justify-center"
	aria-label="return to top"
	transition:fly={{ y: 100, duration: 300 }}
	onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
>
	<Icon icon="mdi:arrow-up-bold" width="3em" height="3em" />

</button>

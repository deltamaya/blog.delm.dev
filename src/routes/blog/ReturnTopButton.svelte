<script>
	import Icon from '@iconify/svelte';
</script>

<button
	class="fixed bottom-10 right-5 flex items-center justify-center"
	aria-label="return to top"
	onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
>
	<Icon icon="emojione-monotone:up-arrow" width="2.4em" height="2.4em" />
</button>

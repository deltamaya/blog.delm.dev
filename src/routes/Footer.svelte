<script>
	import { languageTag } from '$lib/paraglide/runtime.js';
</script>
<footer
	class="font-inter z-40 flex h-10 items-center justify-center bg-neutral-50 py-4 font-Sans text-neutral-600 dark:bg-neutral-900 dark:text-neutral-50 transition-colors"
>
	<div class="z-40 flex flex-wrap items-center justify-center text-center sm:text-sm text-xs">
		<span class="inline-block">©&nbsp;</span>
		<span>{new Date().getFullYear()} <a href="https://www.delm.dev" class="underline">deltamaya</a>.
			{#if languageTag()==='en'}
				All works licensed under <a href="https://creativecommons.org/licenses/by/4.0/" class="underline">CC BY 4.0</a>.
			{:else}
				所有作品均在<a href="https://creativecommons.org/licenses/by/4.0/" class="underline">CC BY 4.0</a>许可下发布.
			{/if}
		</span>
	</div>
</footer>

<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';

	let { children } = $props();
</script>

<ParaglideJS {i18n}>
	<Header />
	<div class="min-h-[calc(100vh-6.5rem)] w-full bg-white font-Sans text-neutral-900 dark:text-neutral-50 dark:bg-neutral-900 transition-colors">
		{@render children()}
	</div>
</ParaglideJS>

<Footer />

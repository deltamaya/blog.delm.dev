<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';

	let { children } = $props();

	import ThemeProvider from './ThemeProvider.svelte';
</script>
<svelte:head>
  <script>
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  </script>
</svelte:head>
<ParaglideJS {i18n}>
	<ThemeProvider>
			<Header />
			<div class="min-h-[calc(100vh-6.5rem)] w-full bg-white text-neutral-900 dark:text-neutral-50 dark:bg-neutral-900 transition-colors font-Sans">
				{@render children()}
			</div>
			<Footer />
	</ThemeProvider>
</ParaglideJS>


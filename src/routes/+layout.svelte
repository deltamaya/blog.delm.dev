<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import Header from './Header.svelte';
	import Footer from './Footer.svelte';

	let { children } = $props();

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
	<div class="bg-red-600 h-[2px]"></div>
	<Header />
	<div class="min-h-[calc(100vh-124px)] w-full bg-neutral-50 text-neutral-900 dark:text-white dark:bg-neutral-900 transition-colors font-Sans">
		{@render children()}
	</div>
	<Footer />
</ParaglideJS>


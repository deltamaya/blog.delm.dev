<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import Header from './Header.svelte';

	let { children } = $props();
</script>

<ParaglideJS {i18n}>
	<Header />
	<div class="min-h-[calc(100vh-6.5rem)] w-full bg-white font-IBMPlexSansSC text-neutral-900">
		{@render children()}
	</div>
</ParaglideJS>

<footer
	class="font-inter z-40 flex h-10 items-center justify-center bg-white py-4 font-IBMPlexSansSC text-neutral-500"
>
	<div class="z-40 flex flex-wrap items-center justify-center text-center text-sm">
		<span class="inline-block">©&nbsp;</span>
		<span
			>2024 <a href="https://www.delm.dev" class="hover:underline">Maya</a>. All works
			<a href="https://www.gnu.org/copyleft/" class="hover:underline">Copyleft</a>.</span
		>
	</div>
</footer>

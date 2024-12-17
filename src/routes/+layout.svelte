<script lang="ts">
	import { i18n } from '$lib/i18n';
	import { ParaglideJS } from '@inlang/paraglide-sveltekit';
	import '../app.css';
	import Header from './Header.svelte';

	let { children } = $props();
</script>


<ParaglideJS {i18n}>
	<Header/>
	<div class="font-IBMPlexSansSC min-h-[calc(100vh-6.5rem)] w-full bg-white text-neutral-900">
		{@render children()}
	</div>
</ParaglideJS>

<footer class="text-neutral-500 py-4 flex justify-center items-center font-inter h-10 z-40 font-IBMPlexSansSC bg-white">
	<div class="text-sm text-center flex flex-wrap justify-center items-center z-40">
		<span class="inline-block">©&nbsp;</span>
		<span>2024 <a href="https://www.delm.dev" class="hover:underline">Maya</a>. All works <a
			href="https://www.gnu.org/copyleft/" class="hover:underline">Copyleft</a>.</span>
	</div>
</footer>

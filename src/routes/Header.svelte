<script lang="ts">
	import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
	import { languageTag } from '$lib/paraglide/runtime';
	import { i18n } from '$lib/i18n';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import * as m from '$lib/paraglide/messages.js';
	import Icon from '@iconify/svelte';
	import { isDark } from '$lib/stores';
	import SlideUnderline from './SlideUnderline.svelte';
	import { fade } from 'svelte/transition';

	function switchToLanguage(newLanguage: AvailableLanguageTag) {
		const canonicalPath = i18n.route($page.url.pathname);
		const localisedPath = i18n.resolveRoute(canonicalPath, newLanguage);
		goto(localisedPath, {
			invalidateAll: true
		});
	}

	function gotoHome() {
		const localisedHome = i18n.resolveRoute('/', languageTag());
		goto(localisedHome);
	}

	function toggleLanguage(event: MouseEvent) {
		event.stopPropagation();
		if (languageTag() === 'en') {
			switchToLanguage('zh-cn');
			return;
		}
		switchToLanguage('en');
	}

	function switchTheme() {
		isDark.update((v) => !v);
	}
</script>

<header
	class="flex w-full items-center justify-center border-b-[1px] border-neutral-200 bg-neutral-50 font-Sans font-bold text-neutral-900 transition-colors dark:border-neutral-800 dark:bg-neutral-900 dark:text-white"
>
	<div class="flex w-full max-w-[1440px] flex-wrap items-center justify-between gap-5 px-5 py-1">
		<div class="flex items-center space-x-3">
			<button class="flex items-center space-x-3" onclick={() => gotoHome()}>
				<span class="text-lg font-bold md:text-xl lg:text-2xl">
					DELM.<span class="text-red-600">{languageTag() === 'en' ? languageTag() : 'zh'}</span>
				</span>
			</button>
			<div class="flex items-center space-x-3 text-sm md:text-base lg:text-lg">
				<div class="relative flex text-left">
					<button
						aria-label="languages"
						class="flex items-center justify-center transition-colors duration-200 hover:text-red-600"
						onclick={(event) => {
							toggleLanguage(event);
						}}
					>
						<Icon icon="material-symbols:language" width="24" height="24" />
					</button>
				</div>
				<div class="relative flex text-left">
					<button
						class="items-center justify-center transition-colors duration-200 hover:text-red-600"
						onclick={() => switchTheme()}
					>
						{#if $isDark}
							<Icon icon="solar:moon-broken" width="24" height="24" />
						{:else}
							<Icon icon="ri:sun-fill" width="24" height="24" />
						{/if}
					</button>
				</div>
			</div>
		</div>

		<nav
			class="flex items-center justify-center space-x-6 text-sm font-bold md:text-base lg:text-lg"
		>
			<a href="/archive/{new Date().getFullYear()}" class="transition-colors hover:text-red-600">
				{m.Archive()}
			</a>
			<a href="/search" class="transition-colors hover:text-red-600">
				{m.Search()}
			</a>
			<a href="/tags" class="transition-colors hover:text-red-600">
				{m.Tags()}
			</a>

			<div class="flex">
				<a
					href="https://delm.dev"
					class="relative flex h-[40px] w-[40px] items-center justify-center md:h-[45px] md:w-[45px] lg:h-[50px] lg:w-[50px]"
				>
					{#if $isDark}
						<img
							src="/logo-white.svg"
							alt="logo-white"
							transition:fade={{ duration: 400 }}
							class="absolute h-[40px] w-[40px] md:h-[45px] md:w-[45px] lg:h-[50px] lg:w-[50px]"
						/>
					{:else}
						<img
							src="/logo.svg"
							alt="logo"
							transition:fade={{ duration: 400 }}
							class="absolute h-[40px] w-[40px] md:h-[45px] md:w-[45px] lg:h-[50px] lg:w-[50px]"
						/>
					{/if}
				</a>
			</div>
		</nav>
	</div>
</header>

<style>
</style>

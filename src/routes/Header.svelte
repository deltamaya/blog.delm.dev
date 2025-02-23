<script lang="ts">
	import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
	import { languageTag } from '$lib/paraglide/runtime';
	import { i18n } from '$lib/i18n';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import * as m from '$lib/paraglide/messages.js';
	import Icon from '@iconify/svelte';

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

	let showLanguageDropMenu = $state(false);
	let isDark = $state(false);

	function toggleDropdown(event: MouseEvent) {
		event.stopPropagation();
		showLanguageDropMenu = !showLanguageDropMenu;
	}


	function hideDropMenu() {
		showLanguageDropMenu = false;
	}

	function toggleDarkTheme() {
		isDark = !isDark;
		if (isDark) {
			document.documentElement.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			document.documentElement.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}

	$effect(() => {
		window.addEventListener('click', hideDropMenu);
		const theme = localStorage.getItem('theme');
		isDark = theme === 'dark';
		if (isDark) {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
		return () => {
			window.removeEventListener('click', hideDropMenu);
		};
	});
</script>

<header
	class="flex min-h-16 w-full items-center justify-center bg-neutral-50 font-Sans font-bold text-neutral-900 dark:bg-neutral-900 dark:text-white transition-colors"
>
	<div class="flex w-full max-w-[1024px] flex-wrap items-center justify-between gap-5 p-4">
		<div class="flex items-center space-x-3">
			<button class="flex items-center space-x-3" onclick={() => gotoHome()}>
				<span class="text-lg font-bold md:text-xl lg:text-2xl"
				>DELM.<span class="text-red-600">{languageTag()}</span></span
				>
			</button>
			<div class="flex items-center space-x-3 text-sm md:text-base lg:text-lg">
				<div class="relative flex text-left">
					<button
						aria-label="languages"
						class="flex hover:text-red-600 justify-center items-center"
						onclick={(event)=>{toggleDropdown(event)}}
					>
						<Icon icon="material-symbols:language" width="24" height="24"/>
					</button>
					{#if showLanguageDropMenu}
						<div
							id="dropdownMenu"
							class="absolute mt-2 w-28 rounded-md bg-neutral-100 dark:bg-neutral-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-20"
							aria-orientation="vertical"
							aria-labelledby="dropdownButton"
						>
							<button
								class="block w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-100 hover:text-red-600 dark:hover:text-red-600"
								class:active={languageTag() === 'en'}
								onclick={() => switchToLanguage('en')}
							>
								English
							</button>
							<button
								class="block w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-100 hover:text-red-600 dark:hover:text-red-600"
								onclick={() => switchToLanguage('zh-cn')}
								class:active={languageTag() === 'zh-cn'}
							>
								简体中文
							</button>
							<button
								class="block w-full px-4 py-2 text-sm text-neutral-700 dark:text-neutral-100 hover:text-red-600 dark:hover:text-red-600"
								onclick={() => switchToLanguage('zh-tw')}
								class:active={languageTag() === 'zh-tw'}
							>
								繁體中文
							</button>
						</div>
					{/if}
				</div>
				<div class="relative flex text-left">
					<button class="hover:text-red-600 justify-center items-center" onclick="{()=>toggleDarkTheme()}">
						{#if !isDark}
							<Icon icon="ri:sun-fill" width="24" height="24" />
						{:else}
							<Icon icon="solar:moon-broken" width="24" height="24" />
						{/if}
					</button>
				</div>
			</div>
		</div>

		<nav
			class="flex items-center justify-center space-x-6 text-sm font-bold md:text-base lg:text-lg"
		>
			<a href="/archive/{new Date().getFullYear()}" class="hover:underline hover:text-red-600">{m.Archive()}</a>
			<a href="/search" class="hover:underline hover:text-red-600">{m.Search()}</a>
			<a href="/tags" class="hover:underline hover:text-red-600">{m.Tags()}</a>

			<div class="flex">
				<a href="https://delm.dev" class="flex hover:underline">
					{#if isDark}
						<img
							src="/logo-white.png"
							alt="Logo"
							class="mb-1 h-[24px] w-[45px] lg:h-[27px] lg:w-[50px]"
						/>
					{:else}
						<img
							src="/logo-dark.png"
							alt="Logo"
							class="mb-1 h-[24px] w-[45px] lg:h-[27px] lg:w-[50px]"
						/>
					{/if}
				</a>
			</div>
		</nav>
	</div>
</header>

<style>
    .active {
        @apply font-bold text-red-600 underline;
    }
</style>

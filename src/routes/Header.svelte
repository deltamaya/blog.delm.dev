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
	class="flex w-full items-center justify-center bg-neutral-50 font-Sans font-bold text-neutral-900 dark:bg-neutral-900 dark:text-white transition-colors  border-b-[1px] border-neutral-200 dark:border-neutral-800"
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
						class="flex hover:text-red-600 justify-center items-center transition-colors duration-200"
						onclick={(event)=>{toggleLanguage(event)}}
					>
						<Icon icon="material-symbols:language" width="24" height="24" />
					</button>
				</div>
				<div class="relative flex text-left">
					<button class="hover:text-red-600 transition-colors duration-200 justify-center items-center"
									onclick="{()=>switchTheme()}">
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
			<a href="/archive/{new Date().getFullYear()}" class="hover:text-red-600 transition-colors">
				<SlideUnderline>
					{m.Archive()}
				</SlideUnderline>
			</a>
			<a href="/search" class="hover:text-red-600 transition-colors">
				<SlideUnderline>
					{m.Search()}
				</SlideUnderline>
			</a>
			<a href="/tags" class="hover:text-red-600 transition-colors">
				<SlideUnderline>
					{m.Tags()}
				</SlideUnderline>
			</a>

			<div role="region" onmouseenter={()=>{drawLogo=true;console.log('aasdf')}} onmouseleave={()=>drawLogo=false} class="flex">
				<a href="https://delm.dev" class="flex">
					{#if $isDark}
						<img src="/logo-white.svg" alt="logo"
								 class="lg:w-[50px] lg:h-[50px] md:w-[45px] md:h-[45px] w-[40px] h-[40px]" />
					{:else}
						<img src="/logo.svg" alt="logo"
								 class="lg:w-[50px] lg:h-[50px] md:w-[45px] md:h-[45px] w-[40px] h-[40px]" />
					{/if}
				</a>
			</div>
		</nav>
	</div>
</header>

<style>
</style>

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

	function toggleDropdown(event: MouseEvent) {
		event.stopPropagation();
		showLanguageDropMenu = !showLanguageDropMenu;
	}

	function hideDropMenu() {
		showLanguageDropMenu = false;
	}

	$effect(() => {
		window.addEventListener('click', hideDropMenu);
		return () => {
			window.removeEventListener('click', hideDropMenu);
		};
	});

</script>

<header
	class="flex min-h-16 w-full items-center justify-center bg-neutral-50 font-Sans text-neutral-900 font-bold"
>
	<div class="flex w-full max-w-[1024px] flex-wrap items-center justify-between gap-5 p-4">
		<div class="flex items-center space-x-3">
			<button class="flex items-center space-x-3" onclick={() => gotoHome()}>
				<span class="lg:text-2xl md:text-xl text-lg font-bold">DELM.<span
					class="text-red-600">{languageTag()}</span></span>
			</button>
			<div class="flex space-x-3 lg:text-lg md:text-base text-sm">
				<div class="relative inline-block text-left">
					<button
						aria-label="languages"
						class="flex hover:text-red-600"
						onclick={(event)=>toggleDropdown(event)}
					>
						<Icon icon="material-symbols:language" width="1.5em" height="1.5em" />
					</button>
					{#if showLanguageDropMenu}
						<div
							id="dropdownMenu"
							class="origin-top-right absolute left-0 mt-2 w-28 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
							aria-orientation="vertical"
							aria-labelledby="dropdownButton"
						>
							<button
								class="w-full block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100  hover:text-red-600"
								class:active={languageTag()==='en'}
								onclick={()=>switchToLanguage('en')}
							>
								English
							</button>
							<button
								class="w-full block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-red-600"
								onclick={()=>switchToLanguage('zh-cn')}
								class:active={languageTag()==='zh-cn'}
							>
								简体中文
							</button>
							<button
								class="w-full block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 hover:text-red-600"
								onclick={()=>switchToLanguage('zh-tw')}
								class:active={languageTag()==='zh-tw'}
							>
								繁體中文
							</button>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<nav class="flex items-center justify-center space-x-6 font-bold lg:text-lg md:text-base text-sm">
			<a href="/archive" class="hover:underline">{m.Archive()}</a>
			<a href="/search" class="hover:underline">{m.Search()}</a>
			<a href="/tags" class="hover:underline">{m.Tags()}</a>

			<div class="flex">
				<a href="https://delm.dev" class="flex hover:underline">
					<img src="/logo-dark.png" alt="Logo" class="mb-1 lg:h-[27px] lg:w-[50px] h-[24px] w-[45px]" />

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

<script lang="ts">
	import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
	import { languageTag } from '$lib/paraglide/runtime';
	import { i18n } from '$lib/i18n';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import * as m from '$lib/paraglide/messages.js';

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
</script>

<header
	class="flex min-h-16 w-full items-center justify-center bg-neutral-50 font-Sans text-neutral-900 font-bold"
>
	<div class="flex w-full max-w-[1024px] flex-wrap items-center justify-between gap-5 p-4">
		<div class="flex items-center space-x-3">
			<button class="flex items-center space-x-3" onclick={() => gotoHome()}>
				<span class="lg:text-2xl md:text-xl text-lg font-bold">DELM</span>
				<img src="/logo-dark.png" alt="Logo" class="mb-1 lg:h-[27px] lg:w-[50px] h-[24px] w-[45px]" />
			</button>
			<div class="h-5 w-0.5 bg-gray-900"></div>
			<div class="flex space-x-3 lg:text-lg md:text-base text-sm">
				<button
				onclick={() => switchToLanguage('en')}
				class="hover:underline"
				class:active={languageTag() === 'en'}
			>
				EN
			</button>
			<button
				onclick={() => switchToLanguage('zh-cn')}
				class="hover:underline"
				class:active={languageTag() === 'zh-cn'}
			>
				ZH-CN
			</button>
			<button
				onclick={() => switchToLanguage('zh-tw')}
				class="hover:underline"
				class:active={languageTag() === 'zh-tw'}
			>
				ZH-TW
			</button>
			</div>
		</div>

		<nav class="flex items-center justify-center space-x-6 font-bold lg:text-lg md:text-base text-sm">
			<a href="/archive" class="hover:underline">{m.Archive()}</a>
			<a href="/search" class="hover:underline">{m.Search()}</a>
			<a href="/tags" class="hover:underline">{m.Tags()}</a>
			<div class="flex">
				<a href="https://delm.dev" class="flex hover:underline">
					delm.dev
					<svg
						fill="none"
						shape-rendering="geometricPrecision"
						stroke="currentColor"
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2.5"
						viewBox="0 0 24 24"
						height="12"
						width="12"
					>
						<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
						<path d="M15 3h6v6"></path>
						<path d="M10 14L21 3"></path>
					</svg>
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

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
		console.log(languageTag());
		goto(localisedPath);
	}

</script>
<header class="w-full min-h-16 flex font-IBMPlexSansSC bg-stone-200">
	<div class="w-full mx-auto flex items-center justify-between p-4 flex-wrap max-w-[1024px] gap-5">
		<div class="flex items-center space-x-3 mr-6">
			<span class="text-2xl font-bold">DELM</span>
			<img src="/logo-dark.png" alt="Logo" class="h-6 mb-1">
			<div class="w-0.5 h-5 bg-gray-900">
			</div>
			<button onclick={()=>switchToLanguage('en')} class="hover:underline" class:active={languageTag()==='en'}>
				EN
			</button>
			<button onclick={()=>switchToLanguage('zh-cn')} class="hover:underline" class:active={languageTag()==='zh-cn'}>
				ZH-CN
			</button>
			<button onclick={()=>switchToLanguage('zh-tw')} class="hover:underline" class:active={languageTag()==='zh-tw'}>
				ZH-TW
			</button>
		</div>

		<nav class="space-x-6 flex font-bold justify-center items-center">
			<a href="/archive" class="hover:underline">{m.Archive()}</a>
			<a href="/search" class="hover:underline">{m.Search()}</a>
			<a href="/tags" class="hover:underline">{m.Tags()}</a>
			<div class="flex"><a href="https://delm.dev" class="hover:underline flex">
				delm.dev
				<svg fill="none" shape-rendering="geometricPrecision" stroke="currentColor" stroke-linecap="round"
						 stroke-linejoin="round" stroke-width="2.5" viewBox="0 0 24 24" height="12" width="12">
					<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"></path>
					<path d="M15 3h6v6"></path>
					<path d="M10 14L21 3"></path>
				</svg>
			</a></div>

		</nav>

	</div>
</header>

<style>
	.active{
			@apply font-bold text-red-600 underline;
	}
</style>
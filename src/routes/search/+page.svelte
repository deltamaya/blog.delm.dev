<script>
		import * as m from '$lib/paraglide/messages.js';
	let keyword = $state('');
</script>
<div class="flex flex-col items-center w-full h-full">
	<div class="h-full w-full max-w-[48rem] p-4">
		<div class="text-4xl font-bold py-6">
			{m.Search()}
		</div>
		<div class="flex flex-col justify-center items-center">
			<input type="text" bind:value={keyword} placeholder={m.SearchHere()}
						 class="text-neutral-400 border-2 border-neutral-300 rounded-2xl px-3 py-2 font-bold w-full" />
			<button onclick={()=>window.location=`https://duckduckgo.com/?sites=blog.delm.dev&q=${keyword}&ia=web`}
							class="bg-red-500 rounded-2xl w-32 flex px-3 py-2 text-white font-bold justify-center items-center mt-3">
				{m.Search()}
			</button>
		</div>

	</div>
</div>
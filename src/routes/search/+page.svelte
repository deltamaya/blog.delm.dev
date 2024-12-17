<script>
	let keyword=$state('')
</script>
<div>
	<input type="text" bind:value={keyword} placeholder="keyword"/>
	<button onclick={()=>window.location=`https://duckduckgo.com/?sites=blog.delm.dev&q=${keyword}&ia=web`}>
		search
	</button>
</div>
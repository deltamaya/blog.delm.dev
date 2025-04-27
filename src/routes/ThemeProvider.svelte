<script>
	import {isDark} from '$lib/stores.js'
	let {children}=$props()
</script>

<div class:dark={$isDark}>
	{@render children()}
</div>
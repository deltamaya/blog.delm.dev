<script>
  export let data;

</script>

<h1>{data.metadata.title}</h1>
<p><small>{data.metadata.date}</small></p>
<div>
  {@html data.content}
</div>

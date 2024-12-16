<script>
  let {data}=$props()
</script>

<div class="flex flex-col items-center w-full">
<h1>我的博客</h1>
<ul>
  {#each data.posts as post}
    <li>
      <a href={`/blog/${post.slug}`}>{post.title}</a> - {post.date}
    </li>
  {/each}
</ul>
</div>


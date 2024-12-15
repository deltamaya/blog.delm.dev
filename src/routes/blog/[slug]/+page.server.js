import fs from 'fs';
import path from 'path';
import {parseFrontMatter} from "$lib/posts"

export function load({ params }) {
  const { slug } = params;
  const filePath = path.resolve(`content/en/${slug}.md`);
  const content = fs.readFileSync(filePath, 'utf-8');
  const blog = parseFrontMatter(content);

  return {
    content: blog.content,
    metadata:blog.metadata,
  };
}


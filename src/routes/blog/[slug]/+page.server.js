import fs from 'fs';
import path from 'path';
import {parseFrontMatter} from "$lib/posts"
import { languageTag } from '$lib/paraglide/runtime';

export function load({ params }) {
  const { slug } = params;
  console.log(languageTag())
  const filePath = path.resolve(`content/${languageTag()}/${slug}.md`);
  const content = fs.readFileSync(filePath, 'utf-8');
  const blog = parseFrontMatter(content);

  return {
    content: blog.content,
    metadata:blog.metadata,
  };
}


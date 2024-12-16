import fs from 'fs';
import path from 'path';
import { languageTag } from '$lib/paraglide/runtime';
import matter from 'gray-matter';

export function load({ params }) {
  const { slug } = params;
  const filePath = path.resolve(`content/${languageTag()}/${slug}.md`);
  const content = fs.readFileSync(filePath, 'utf-8');
  const data=matter(content)

  return {
    content: data.content,
    metadata:data.data,
  };
}


import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { languageTag } from '$lib/paraglide/runtime.js';
export function load() {
  const postsDirectory = path.resolve(`content/${languageTag()}`);
  const files = fs.readdirSync(postsDirectory);

  const posts = files.map((file) => {
    const filePath = path.join(postsDirectory, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(content);

    return {
      slug: file.replace(/\.md$/, ''),
      ...data,
    };
  });
  return { posts };
}



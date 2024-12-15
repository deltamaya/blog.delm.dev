import fs from 'fs';
import path from 'path';
import {parseFrontMatter} from "$lib/posts"
export function load() {
  const postsDirectory = path.resolve('content/en');
  const files = fs.readdirSync(postsDirectory);

  const posts = files.map((file) => {
    const filePath = path.join(postsDirectory, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { metadata } = parseFrontMatter(content);

    return {
      slug: file.replace(/\.md$/, ''),
      ...metadata,
    };
  });
  return { posts };
}



import fs from 'fs';
import path from 'path';

const postsDirectory = path.resolve('content/en');

export function getAllPosts() {
  const files = fs.readdirSync(postsDirectory);

  return files.map((file) => {
    const filePath = path.join(postsDirectory, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const { metadata } = parseFrontMatter(content);

    return {
      slug: file.replace(/\.md$/, ''),
      ...metadata,
    };
  });
}

export function parseFrontMatter(content) {
  const match = content.match(/---\r?\n([\s\S]+?)\r?\n---/);
  if (!match) return { metadata: {}, content };

  const frontMatter = match[1];
  const body = content.slice(match[0].length);

  const metadata = Object.fromEntries(
    frontMatter.split('\n').map((line) => {
      const [key, ...value] = line.split(':');
      return [key.trim(), value.join(':').trim()];
    })
  );
  console.log(body)
  return { metadata, content: body };
}
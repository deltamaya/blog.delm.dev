import openai
import re
import os
from pathlib import Path

# Set your OpenAI API key
openai.api_key = "YOUR_API_KEY_HERE"


def extract_frontmatter_and_content(text):
    """Separate frontmatter and main content."""
    frontmatter_pattern = r'^---\s*\n(.*?)\n---\s*\n'
    match = re.match(frontmatter_pattern, text, re.DOTALL)
    if match:
        frontmatter = match.group(0)
        content = text[match.end():]
        return frontmatter, content
    return "", text


def preserve_code_blocks(text):
    """Extract code blocks and replace with placeholders."""
    code_blocks = []

    def replace_code(match):
        code_blocks.append(match.group(0))
        return f"CODEBLOCK_{len(code_blocks) - 1}"

    # Match both triple backtick and indented code blocks
    pattern = r'```[\s\S]*?```|\n\s{4}.*?(?=\n[^ ]|\Z)'
    protected_text = re.sub(pattern, replace_code, text, flags=re.MULTILINE)
    return protected_text, code_blocks


def restore_code_blocks(text, code_blocks):
    """Restore code blocks from placeholders."""
    for i, code in enumerate(code_blocks):
        text = text.replace(f"CODEBLOCK_{i}", code)
    return text


def translate_text(text, target_language):
    """Translate text using OpenAI API."""
    prompt = f"""Translate the following text to {target_language}. Preserve markdown syntax and do not translate text within code block placeholders (like CODEBLOCK_0). Only translate the natural language content:

    {text}
    """

    response = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[
            {"role": "system", "content": "You are a translator that preserves markdown formatting."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.3
    )

    return response.choices[0].message.content


def translate_file(input_file, output_file, target_language):
    """Translate a single markdown file."""
    try:
        # Read the input file
        with open(input_file, 'r', encoding='utf-8') as f:
            original_text = f.read()

        # Separate frontmatter and content
        frontmatter, content = extract_frontmatter_and_content(original_text)

        # Protect code blocks
        protected_content, code_blocks = preserve_code_blocks(content)

        # Translate the content
        translated_content = translate_text(protected_content, target_language)

        # Restore code blocks
        final_content = restore_code_blocks(translated_content, code_blocks)

        # Combine frontmatter with translated content
        final_text = frontmatter + final_content

        # Write to output file
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(final_text)

        print(f"Successfully translated {input_file} to {output_file}")

    except Exception as e:
        print(f"Error processing {input_file}: {str(e)}")


def translate_directory(input_dir, output_dir, target_language):
    """Translate all markdown files in a directory."""
    input_path = Path(input_dir)
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    for md_file in input_path.glob("*.md"):
        output_file = output_path / md_file.name
        translate_file(md_file, output_file, target_language)


# Example usage
if __name__ == "__main__":
    # Single file translation
    input_file = "blog_post.md"
    output_file = "blog_post_es.md"
    target_language = "Spanish"

    translate_file(input_file, output_file, target_language)

    # Directory translation
    # input_directory = "blog_posts"
    # output_directory = "blog_posts_translated"
    # translate_directory(input_directory, output_directory, "Spanish")
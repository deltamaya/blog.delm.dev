import httpx
import json
import os
import frontmatter
import re

EN = "en"
CN = "zh-cn"
TW = "zh-tw"

# === Config the settings ===
# supports zh-cn, zh-cn, en
SOURCE_LANGUAGE = CN
TARGET_LANGUAGE = EN
FILENAME = "concurrent-control"


with open("./secrets.json", "r") as f:
    secrets = json.load(f)
    OPENAI_KEY = secrets["openai_key"]


# Set your OpenAI API key
header = {
    "Authorization": f"Bearer {OPENAI_KEY}",
    "Content-Type": "application/json",
}


def extract_frontmatter_and_content(text, target_language):
    """Separate frontmatter and main content."""
    parsed = frontmatter.loads(text)
    curFrontmatter = parsed.metadata
    curFrontmatter["ai"] = True
    titleTemp: str = translate_content(curFrontmatter["title"], target_language)
    curFrontmatter["title"] = titleTemp.strip()
    frontmatterText = "---\n"
    for k, v in curFrontmatter.items():
        frontmatterText += f"{k}: {v}\n"
    frontmatterText += "---\n"
    return frontmatterText, parsed.content


def preserve_code_blocks(text):
    """Extract code blocks and replace with placeholders."""
    code_blocks = []

    def replace_code(match):
        code_blocks.append(match.group(0))
        return f"CODEBLOCK_{len(code_blocks) - 1}"

    # Match both triple backtick and indented code blocks
    pattern = r"```[\s\S]*?```|\n\s{4}.*?(?=\n[^ ]|\Z)"
    protected_text = re.sub(pattern, replace_code, text, flags=re.MULTILINE)
    return protected_text, code_blocks


def restore_code_blocks(text, code_blocks):
    """Restore code blocks from placeholders."""
    for i, code in enumerate(code_blocks):
        text = text.replace(f"CODEBLOCK_{i}", code)
    return text


def send_api_request(data) -> str:
    response = httpx.post(
        "https://api.deepseek.com/chat/completions",
        headers=header,
        data=json.dumps(data),
        verify=False,
        timeout=9999,
    )
    return response.json()["choices"][0]["message"]["content"]


def translate_content(text, target_language):
    """Translate text using OpenAI API."""
    prompt = f"""Translate the following text to {target_language}.
    Preserve markdown syntax and do not translate text within code block placeholders (like CODEBLOCK_0).
    Only translate the natural language content, do not output any redundant message, just pure translated content:

    {text}
    """

    data = {
        "model": "deepseek-chat",
        "messages": [
            {
                "role": "system",
                "content": "You are a translator that preserves markdown formatting.",
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        "temperature": 1.3,
    }
    return send_api_request(data)


def polish_content(text) -> str:
    """Translate text using OpenAI API."""
    prompt = f"""Polish this article, making it more interesting and accurate, but do not translate it, if it is Chinese, then output Chinese, if it is English, output English.
     Preserve markdown syntax and do not modify text within code block placeholders (like CODEBLOCK_0). Only polish the natural language content, do not output any redundant message, just pure polished content:

       {text}
       """

    data = {
        "model": "deepseek-chat",
        "messages": [
            {
                "role": "system",
                "content": "You are a programmer and interesting tech blog writer.",
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        "temperature": 1.3,
    }
    return send_api_request(data)


def process_file(operation, input_file, output_file, target_language):
    """Translate a single markdown file."""
    try:
        # Read the input file
        with open(input_file, "r", encoding="utf-8") as f:
            original_text = f.read()

        # Separate frontmatter and content
        frontmatter, content = extract_frontmatter_and_content(
            original_text, target_language
        )

        # Protect code blocks
        protected_content, code_blocks = preserve_code_blocks(content)

        if operation == "translate" or operation == "t":
            # Translate the content
            output_content = translate_content(protected_content, target_language)
        elif operation == "polish" or operation == "p":
            output_content = polish_content(protected_content)
        else:
            raise ValueError("Invalid operation. Use 'translate' or 'polish'.")

        # Restore code blocks
        final_content = restore_code_blocks(output_content, code_blocks)

        # Combine frontmatter with translated content
        final_text = frontmatter + final_content

        # Write to output file
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(final_text)

        print(f"Successfully translated {input_file} to {output_file}")

    except Exception as e:
        print(f"Error processing {input_file}: {str(e)}")


# Example usage
if __name__ == "__main__":
    # Single file translation
    input_file = f"./content/{SOURCE_LANGUAGE}/{FILENAME}.md"
    output_file = f"./content/{TARGET_LANGUAGE}/{FILENAME}.md"

    language_map = {
        "zh-cn": "Chinese Simplified",
        "zh-tw": "Chinese Traditional",
        "en": "English",
    }

    process_file("t", input_file, output_file, language_map[TARGET_LANGUAGE])

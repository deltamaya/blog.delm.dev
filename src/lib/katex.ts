import { marked, type Tokens } from 'marked';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export function katexHandler(text: Tokens.Text) {
	const katexBlockRegex = /\$\$(.*?)\$\$/g; // $$...$$ 包裹的 LaTeX 语法
	const result = text.text.replace(katexBlockRegex, (_, latex) => {
		try {
			return katex.renderToString(latex, {
				displayMode: true
			});
		} catch (error) {
			console.error('KaTeX render error:', error);
			return latex;
		}
	});

	const katexInlineRegex = /\$(.*?)\$/g; // $$...$$ 包裹的 LaTeX 语法
	return result.replace(katexInlineRegex, (_, latex) => {
		try {
			return katex.renderToString(latex, {
				displayMode: false
			});
		} catch (error) {
			console.error('KaTeX render error:', error);
			return latex;
		}
	});
}

export function katexBlockHandler(text: Tokens.Paragraph) {
	const result = marked.Parser.parseInline(text.tokens);

	return result.replace(katexRegex, (_, latex) => {
		try {
			return katex.renderToString(latex, {
				throwOnError: false
			});
		} catch (error) {
			console.error('KaTeX render error:', error);
			return latex;
		}
	});
}

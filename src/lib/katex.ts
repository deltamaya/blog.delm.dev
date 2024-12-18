import { marked, type Tokens } from 'marked';
import katex from 'katex';
import 'katex/dist/katex.min.css';

export function katexHandler(text: Tokens.Text) {
	const katexBlockRegex = /\$\$(.*?)\$\$/g;
	if (text&&text.tokens){
		return marked.Parser.parseInline(text.tokens)
	}
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

	const katexInlineRegex = /\$(.*?)\$/g;
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


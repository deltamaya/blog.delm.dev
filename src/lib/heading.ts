import { marked, type Tokens } from 'marked';



export function headingHandler(heading:Tokens.Heading,headings: { depth: number; text: string; id: string }[]){
 const id = heading.text.toLowerCase().replace(/\s+/g, '-');
	headings.push({ depth:heading.depth,text: heading.text, id})
	return  `<h${heading.depth} id="${id}">${marked.Parser.parseInline(heading.tokens)}</h${heading.depth}>`;
}

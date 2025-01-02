interface AuthorData {
	url: string;
}

export const RegisteredAuthors = new Map<string, AuthorData>([
	[
		'Maya',
		{
			url: 'https://delm.dev'
		}
	]
]);

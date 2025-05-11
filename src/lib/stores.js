import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export const isDark = writable(true);

isDark.subscribe((value) => {
	if (browser) {
		localStorage.setItem('theme', value ? 'dark' : 'light');
		document.documentElement.classList.toggle('dark', value);
	}
});
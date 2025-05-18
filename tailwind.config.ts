import flowbitePlugin from 'flowbite/plugin';

import type { Config } from 'tailwindcss';

export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
	],
	darkMode: ['class', '[data-theme="dark"]'],

	plugins: [flowbitePlugin]
} as Config;

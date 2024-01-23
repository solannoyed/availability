/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/routes/**/*.{html,js,svelte,ts}', './src/app.html'],
	theme: {
		extend: {}
	},
	plugins: [require('daisyui')],
	daisyui: {
		themes: [
			{
				light: {
					...require('daisyui/src/theming/themes')['light'],
					'.td-unavailable': {
						'background-color': '#fca5a5'
					},
					'.td-inconvenient': {
						'background-color': '#fed7aa'
					},
					'.td-available': {
						'background-color': '#d9f99d'
					},
					'.td-preferred': {
						'background-color': '#86efac'
					},
					'.td-past': {
						'background-color': '#fafafa'
					}
				},
				dark: {
					...require('daisyui/src/theming/themes')['dark'],
					'.td-unavailable': {
						'background-color': '#7f1d1d'
					},
					'.td-inconvenient': {
						'background-color': '#9a3412'
					},
					'.td-available': {
						'background-color': '#3f6212'
					},
					'.td-preferred': {
						'background-color': '#65a30d'
					},
					'.td-past': {
						'background-color': '#20282f'
					}
				}
			}
		]
	}
};

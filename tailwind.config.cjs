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
					'.td-neutral': {
						'background-color': '#fafafa',
						opacity: '0'
					},
					'.td-unavailable': {
						'background-color': '#f87171'
					},
					'.td-inconvenient': {
						'background-color': '#fecaca'
					},
					'.td-available': {
						'background-color': '#bbf7d0'
					},
					'.td-preferred': {
						'background-color': '#4ade80'
					},
					'.td-past': {
						opacity: '0.8'
					},
				},
				dark: {
					...require('daisyui/src/theming/themes')['dark'],
					'.td-neutral': {
						'background-color': '#20282f',
						opacity: '0'
					},
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
						opacity: '0.8'
					}
				}
			}
		]
	}
};

/** @type {import('tailwindcss').Config} */

const colors = {
	transparent: twColors.transparent,
	black: '#454953',
	white: twColors.white,
	secondary: '#161d25',
	primary: '#FF9902',
	aqua: '#268697',
	'bg-color': '#FF9902'
};

module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
	theme: {
		colors,
		extend: {}
	},
	plugins: []
};

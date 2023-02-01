/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",

		// Or if using `src` directory:
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			backgroundSize: {
				"size-200": "200% 200%",
			},
			backgroundPosition: {
				"pos-0": "0% 0%",
				"pos-100": "100% 100%",
			},
		},
	},
	plugins: [require("prettier-plugin-tailwindcss")],
};

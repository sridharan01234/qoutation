/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f0ff',
          100: '#cce0ff',
          200: '#99c2ff',
          300: '#66a3ff',
          400: '#3385ff',
          500: '#0066ff',  // Deep blue
          600: '#0052cc',
          700: '#003d99',
          800: '#002966',
          900: '#001433',
        },
        secondary: {
          50: '#f0f9f0',
          100: '#dcf0dc',
          200: '#bfe3bf',
          300: '#92d692',  // Light green
          400: '#65c965',
          500: '#38bc38',
          600: '#2d962d',
          700: '#227122',
          800: '#164b16',
          900: '#0b260b',
        },
        accent: {
          DEFAULT: '#00A870',
          light: '#00C584',
          dark: '#008F5E',
        }
      },
      fontFamily: {
        inter: ["var(--font-inter)"],
        poppins: ["var(--font-poppins)"],
        playfair: ["var(--font-playfair)"],
      },
    },
  },
  plugins: [],
};

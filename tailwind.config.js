/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FFFBF5',
          100: '#FFF8ED',
          200: '#FFF0DB',
          300: '#FFE8C9',
          400: '#FFE0B7',
          500: '#FFD8A5',
          600: '#F5C98A',
          700: '#E6B870',
          800: '#D4A55F',
          900: '#C2924E',
        },
        orange: {
          50: '#FFF4ED',
          100: '#FFE8D9',
          200: '#FFD1B3',
          300: '#FFB88C',
          400: '#FF9D66',
          500: '#FF8243',
          600: '#F56B1F',
          700: '#D95708',
          800: '#B34607',
          900: '#8C3606',
        },
        accent: {
          50: '#FFF1E6',
          100: '#FFE3CC',
          200: '#FFC799',
          300: '#FFAB66',
          400: '#FF8F33',
          500: '#FF7300',
          600: '#CC5C00',
          700: '#994500',
          800: '#662E00',
          900: '#331700',
        },
      },
    },
  },
  plugins: [],
}

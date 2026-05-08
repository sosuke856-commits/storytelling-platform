/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'void': '#0a0a0a',
        'slate': '#1a1a1a',
        'grey': '#2d2d2d',
        'text-primary': '#e5e5e5',
        'text-secondary': '#a0a0a0',
        'accent': '#d4af37',
      },
      fontFamily: {
        'serif': ['Georgia', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#e5e5e5',
            a: {
              color: '#d4af37',
              '&:hover': {
                color: '#e5c158',
              },
            },
          },
        },
      },
    },
  },
  plugins: [],
};

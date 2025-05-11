/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      './src/**/*.{js,ts,jsx,tsx}',  // if using src/
      './pages/**/*.{js,ts,jsx,tsx}', // fallback
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['var(--font-geist-sans)', 'sans-serif'],
          mono: ['var(--font-geist-mono)', 'monospace'],
        },
      },
    },
    plugins: [],
  }
  

  
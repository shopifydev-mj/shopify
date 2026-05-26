/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Instrument Serif', 'serif'],
      },
      colors: {
        ink: { 950: '#08090a', 900: '#0e0f10', 800: '#161718', 700: '#1f2123' },
        brand: { DEFAULT: '#96bf47', dark: '#7aa238', light: '#b8db6f' },
      },
      letterSpacing: { tightest: '-0.06em' },
    },
  },
  plugins: [],
};

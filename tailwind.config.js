/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        panel: '#0D0D0D',
        surface: '#141414',
        sky: '#9FDDEA',
        'sky-deep': '#6BCBDE',
        'border-def': '#222222',
        muted: '#A0A0A0',
      },
      fontFamily: {
        display: ['"Barlow Condensed"', '"Bebas Neue"', 'sans-serif'],
        mono: ['"DM Mono"', '"IBM Plex Mono"', 'monospace'],
        sans: ['Inter', '"DM Sans"', 'sans-serif'],
      },
      maxWidth: {
        content: '1280px',
      },
    },
  },
  plugins: [],
}

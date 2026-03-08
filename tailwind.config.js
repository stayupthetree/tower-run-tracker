/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0a0d14',
          panel: '#111827',
        },
        accent: {
          teal: '#00e5cc',
          amber: '#f5a623',
        },
      },
      fontFamily: {
        display: ['Rajdhani', 'Exo 2', 'Orbitron', 'sans-serif'],
        mono: ['JetBrains Mono', 'IBM Plex Mono', 'Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}

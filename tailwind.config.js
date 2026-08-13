/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        aerora: {
          bg: '#FCFAF6',
          ink: '#171717',
          muted: '#5C5650',
          border: '#E8E3DC',
          blue: '#2B4C7E',
          blueLight: '#EEF2F8',
          green: '#2D6A4F',
          greenLight: '#EEF6F2',
          amber: '#9A6F2E',
          amberLight: '#FDF4E7',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        heading: ['Manrope', 'Outfit', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(23,23,23,0.06), 0 1px 2px -1px rgba(23,23,23,0.04)',
        'card-hover': '0 6px 16px 0 rgba(23,23,23,0.08), 0 2px 4px -1px rgba(23,23,23,0.04)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}

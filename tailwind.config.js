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
        sans: ['Manrope', 'sans-serif'],
        heading: ['Manrope', 'sans-serif'],
        mono: ['Manrope', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.72rem', { lineHeight: '1.05rem' }],
        'xs': ['0.8125rem', { lineHeight: '1.25rem' }], // ~13px
        'sm': ['0.9375rem', { lineHeight: '1.45rem' }], // ~15px
        'base': ['1.0625rem', { lineHeight: '1.65rem' }], // ~17px
        'lg': ['1.1875rem', { lineHeight: '1.75rem' }], // ~19px
        'xl': ['1.375rem', { lineHeight: '1.85rem' }], // ~22px
        '2xl': ['1.625rem', { lineHeight: '2.1rem' }], // ~26px
        '3xl': ['2rem', { lineHeight: '2.4rem' }], // ~32px
        '4xl': ['2.5rem', { lineHeight: '2.8rem' }], // ~40px
        '5xl': ['3.25rem', { lineHeight: '3.5rem' }], // ~52px
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

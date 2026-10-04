
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        industrial: {
          950: '#080808',
          900: '#0F0F0F',
          850: '#141414',
          800: '#191919',
          700: '#242424',
          600: '#343434',
          500: '#555555',
          400: '#888888',
          300: '#AAAAAA',
          200: '#D2D2D2',
          100: '#EAEAEA',
          50: '#F5F5F5',
        },

        metallo: {
          orange: '#FF6A00',
          'orange-glow': '#FF7A1A',
          'orange-dark': '#C94F00',
          'orange-muted': 'rgba(255, 106, 0, 0.14)',

          amber: '#F59E0B',
          success: '#42C98A',
          warning: '#F0A43C',
          danger: '#EF5B4D',
          info: '#7FA7FF',
        },
      },

      fontFamily: {
        sans: [
          'Satoshi',
          'General Sans',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],

        display: [
          'General Sans',
          'Satoshi',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],

        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace',
        ],
      },

      boxShadow: {
        'nm-flat':
          '-5px -5px 12px rgba(255,255,255,0.025), 7px 7px 18px rgba(0,0,0,0.55)',

        'nm-flat-hover':
          '-6px -6px 14px rgba(255,255,255,0.03), 9px 9px 22px rgba(0,0,0,0.65)',

        'nm-inset':
          'inset 4px 4px 9px rgba(0,0,0,0.55), inset -3px -3px 8px rgba(255,255,255,0.025)',

        'nm-button':
          '-3px -3px 7px rgba(255,255,255,0.025), 4px 4px 10px rgba(0,0,0,0.5)',

        'glow-orange':
          '0 0 25px -5px rgba(255,106,0,0.30)',

        'glow-orange-strong':
          '0 0 32px -4px rgba(255,106,0,0.45)',

        subtle:
          '0 2px 6px rgba(0,0,0,0.35)',
      },

      borderRadius: {
        'nm': '20px',
        'nm-lg': '24px',
      },

      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },

  plugins: [],
}


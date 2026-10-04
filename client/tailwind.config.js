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
          950: '#1e2030', // Dark background
          900: '#25283a', // Raised surface
          850: '#2a2d42', // Highlight / elevated surface
          800: '#2a2d42', // Border / subtle divider
          700: '#383c56', // Secondary border
          600: '#58627e', // Subtle icons / hints
          500: '#7a86a2', // Meta labels
          400: '#9da1b5', // Secondary text
          300: '#c5c9dc', // Body primary
          200: '#e2e4ef', // Elevated text
          100: '#f5f5f7', // Primary text
          50: '#ffffff',
        },

        metallo: {
          orange: '#7c78e8',          // Soft purple/indigo accent replacing harsh orange
          'orange-glow': '#918df2',
          'orange-dark': '#635fc9',
          'orange-muted': 'rgba(124, 120, 232, 0.16)',

          amber: '#d8aa55',           // Amber warning
          success: '#72c69a',         // Green success
          warning: '#d8aa55',         // Amber warning
          danger: '#d87878',          // Red critical
          info: '#7c78e8',
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
          '6px 6px 12px rgba(20,21,42,0.45), -6px -6px 12px rgba(42,45,66,0.35)',
        'nm-flat-hover':
          '8px 8px 16px rgba(20,21,42,0.55), -8px -8px 16px rgba(42,45,66,0.45)',
        'nm-inset':
          'inset 4px 4px 8px rgba(20,21,42,0.45), inset -4px -4px 8px rgba(42,45,66,0.30)',
        'nm-button':
          '4px 4px 8px rgba(20,21,42,0.45), -4px -4px 8px rgba(42,45,66,0.35)',
        'glow-orange':
          '0 0 25px -5px rgba(124,120,232,0.30)',
        'glow-orange-strong':
          '0 0 32px -4px rgba(124,120,232,0.45)',
        subtle:
          '3px 3px 6px rgba(20,21,42,0.45), -3px -3px 6px rgba(42,45,66,0.35)',
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

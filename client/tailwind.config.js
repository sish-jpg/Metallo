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
          950: '#0a0a0c',
          900: '#111114',
          850: '#16161a',
          800: '#1c1c22',
          700: '#282830',
          600: '#383844',
          500: '#525262',
          400: '#78788c',
          300: '#a4a4b8',
          200: '#d0d0dc',
          100: '#ededf2',
          50: '#f8f8fa',
        },
        metallo: {
          orange: '#FF5A1F',
          'orange-glow': '#FF6B2B',
          'orange-dark': '#C93F0C',
          'orange-muted': 'rgba(255, 90, 31, 0.15)',
          amber: '#F59E0B',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#3B82F6',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'glow-orange': '0 0 25px -5px rgba(255, 90, 31, 0.25)',
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.35)',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Manrope', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#effcf9',
          100: '#d2f5ed',
          200: '#a8e9db',
          300: '#75d8c4',
          400: '#42c3aa',
          500: '#22a088',
          600: '#17806f',
          700: '#14655a',
          800: '#124f47',
          900: '#123f3a',
        },
      },
      boxShadow: {
        soft: '0 14px 50px -14px rgba(34, 160, 136, 0.38)',
        card: '0 4px 24px -8px rgba(2, 6, 23, 0.12)',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-out',
        'scale-in': 'scale-in 0.25s ease-out',
      },
    },
  },
  plugins: [],
}

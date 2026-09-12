/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          orange: '#FF5F00',
          'orange-hover': '#E55400',
          'orange-light': '#FFF1E8',
          yellow: '#FFC800',
          dark: '#111111',
          card: '#1A1A1A',
          border: '#2E2E2E',
          green: '#10B981',
          gold: '#F59E0B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Montserrat', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'ticket': '0 10px 25px -5px rgba(255, 95, 0, 0.25), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
        'glow': '0 0 20px rgba(255, 95, 0, 0.4)',
        'glow-gold': '0 0 20px rgba(245, 158, 11, 0.4)',
      }
    },
  },
  plugins: [],
}

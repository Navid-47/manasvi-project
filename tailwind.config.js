/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          light: '#38bdf8', // Sky 400
          DEFAULT: '#0284c7', // Sky 600
          dark: '#0369a1', // Sky 700
        },
        secondary: {
          light: '#818cf8',
          DEFAULT: '#4f46e5', // Indigo 600
          dark: '#3730a3',
        },
        accent: {
          DEFAULT: '#f59e0b', // Amber 500
          hover: '#d97706',
        },
        text: {
          primary: '#1e293b', // Slate 800
          secondary: '#64748b', // Slate 500
          light: '#94a3b8', // Slate 400
        },
        bg: {
          body: '#f8fafc', // Slate 50
          surface: '#ffffff',
          glass: 'rgba(255, 255, 255, 0.9)',
        },
        border: '#e2e8f0', // Slate 200
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
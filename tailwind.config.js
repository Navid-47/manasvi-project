module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: '#007bff',
        'brand-dark': '#0056b3',
        text: '#222',
        'text-muted': '#666',
        bg: '#f5f7fb',
        surface: '#ffffff',
        border: '#e6e8ec',
      },
      borderRadius: {
        DEFAULT: '10px',
      },
    },
  },
  plugins: [],
}
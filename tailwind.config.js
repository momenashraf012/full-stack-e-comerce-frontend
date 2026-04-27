/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Flat structure for reliability
        'primary': '#4d41df',
        'primary-container': '#675df9',
        'on-primary': '#ffffff',
        
        'secondary': '#5d5f5f',
        'secondary-container': '#dcdddd',
        'on-secondary': '#ffffff',
        
        'tertiary': '#ac2649',
        'tertiary-container': '#ce4060',
        'on-tertiary': '#ffffff',
        
        'background': '#fcf8ff',
        'on-background': '#1b1b21',
        
        'surface': '#fcf8ff',
        'on-surface': '#1b1b21',
        'surface-container': '#efecff',
        'surface-container-low': '#f5f2ff',
        'surface-container-high': '#e8e5ff',
        'surface-container-highest': '#e2e0fc',
        'surface-lowest': '#ffffff',
        
        'on-surface-variant': '#46464f',
        
        'error': '#ba1a1a',
        'error-container': '#ffdad6',
        
        'outline': '#777587',
        'outline-variant': '#c7c4d8',
      },
      fontFamily: {
        headline: ['Cairo', 'sans-serif'],
        body: ['Almarai', 'Inter', 'sans-serif'],
      },
      spacing: {
        '2': '0.5rem',
        '4': '1rem',
        '8': '2rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
      },
      borderRadius: {
        'lg': '1rem',
        'md': '0.75rem',
        'sm': '0.25rem',
      }
    },
  },
  plugins: [],
};

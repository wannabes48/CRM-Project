/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // Enables toggling dark mode manually
  theme: {
    extend: {
      colors: {
        // Custom colors matching your screenshot
        saas: {
          bg: '#161618',       // The deepest background
          surface: '#1E1E20',  // The card backgrounds
          surfaceHover: '#2A2A2D',
          neon: 'var(--brand-color, #B2FF4D)',     // That bright accent green
          neonHover: 'var(--brand-color, #B2FF4D)',
          textMuted: '#8A8A8E',
          textMain: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Inter matches this UI perfectly
      }
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
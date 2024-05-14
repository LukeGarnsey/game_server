/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./index.html"
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          '900': '#0f172a',
          '800': '#1e293b',
          '600': '#475569',
          '400': '#94a3b8',
          '500': '#64748b',
          '200': '#e2e8f0'
        },
        teal: {
          '100': '#ccfbf1',
          '300': '#5eead4',
          '400': '#2dd4bf',
          '700': '#0f766e',
          '800': '#115e59',
          '900': '#134e4a'
        },
        blue:{
          '500': '#3b82f6'
        },
        purple:{
          '600': '#9333ea'
        },
        red:{
          '600': '#e11d48'
        }
      },
    },
  },
  plugins: [],
}


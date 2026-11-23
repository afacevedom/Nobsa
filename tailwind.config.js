/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        lana: {
          DEFAULT: '#F5F1E8',
          deep: '#EBE4D5',
          soft: '#FAF8F3',
        },
        tinta: {
          DEFAULT: '#161917',
          muted: '#4A504C',
          soft: '#6D736E',
        },
        grana: {
          DEFAULT: '#8F2429',
          dark: '#6E191E',
          light: '#B5383E',
        },
        trigo: {
          DEFAULT: '#C98E2B',
          soft: '#E3B45A',
        },
        musgo: {
          DEFAULT: '#2D4839',
          dark: '#1F3328',
          light: '#476A56',
        },
        indigo: {
          telar: '#263654',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        editorial: '0 20px 50px -24px rgba(22, 25, 23, 0.22)',
      },
    },
  },
  plugins: [],
};

import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#08080f',
          card: '#111118',
          elevated: '#1a1a24',
          border: '#242434',
        },
        brand: {
          pink: '#e91e8c',
          purple: '#7c3aed',
          teal: '#06b6d4',
        },
        status: {
          up: '#22c55e',
          down: '#ef4444',
          neutral: '#94a3b8',
          warn: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

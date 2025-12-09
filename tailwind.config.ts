import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        accent: '#0BA5E9',
        midnight: '#0F172A',
        smoke: '#E2E8F0'
      }
    }
  },
  plugins: []
};

export default config;

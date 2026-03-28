import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#0c1220',
          secondary: '#111a2e',
          tertiary: '#162038',
          surface: '#1a2744',
        },
        accent: {
          primary: '#06d6a0',
          secondary: '#118ab2',
          hover: '#05c090',
          muted: 'rgba(6,214,160,0.12)',
        },
        profit: '#06d6a0',
        loss: '#ef476f',
        warning: '#ffd166',
        info: '#118ab2',
        text: {
          primary: '#e8edf5',
          secondary: '#8899b4',
          tertiary: '#4a5e80',
        },
        border: {
          subtle: 'rgba(255,255,255,0.06)',
          default: 'rgba(255,255,255,0.10)',
          hover: 'rgba(6,214,160,0.3)',
        },
        rarity: {
          redDiamond: '#ff2d55',
          diamond: '#5bc0eb',
          gold: '#ffd166',
          silver: '#a8b8d0',
          bronze: '#d4915c',
          common: '#5a6e8a',
        },
      },
      fontFamily: {
        heading: ['var(--font-heading)', 'Sora', 'sans-serif'],
        body: ['var(--font-body)', 'DM Sans', 'sans-serif'],
        mono: ['var(--font-mono)', 'Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};

export default config;

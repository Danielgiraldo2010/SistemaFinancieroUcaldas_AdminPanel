import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/features/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: '#667eea', dark: '#5a6fd8', light: '#7c91ee' },
        secondary: { DEFAULT: '#764ba2', dark: '#5f3b82' },
      },
    },
  },
  plugins: [],
}
export default config

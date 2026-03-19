import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ucaldas: {
          blue:      '#003e70',
          blueDark:  '#00284d',
          gold:      '#d5bb87',
          goldLight: '#efd9af',
          slate:     '#F4F7FE',
        },
        primary: {
          DEFAULT: '#003e70',
          dark:    '#00284d',
          light:   '#d5bb87',
        },
      },
      keyframes: {
        bgFloat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
      animation: {
        bgFloat: 'bgFloat 20s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
export default config

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ecnw: {
          primary: '#5C1F3D',
          secondary: '#1A3A52',
          accent: '#00CC00',
          light: '#F5F1E8',
          dark: '#1A1A1A',
          navy: '#1A3A52',
          maroon: '#5C1F3D',
        },
      },
    },
  },
  plugins: [],
}
export default config

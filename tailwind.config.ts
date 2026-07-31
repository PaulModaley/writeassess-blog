import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './sanity/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Matches main WriteAssess app brand tokens
        primary: 'hsl(187, 65%, 42%)',
        'primary-foreground': '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-links': 'hsl(187, 65%, 42%)',
            a: {
              color: 'hsl(187, 65%, 42%)',
              '&:hover': { color: 'hsl(187, 65%, 35%)' },
            },
          },
        },
      },
    },
  },
  plugins: [typography],
}

export default config

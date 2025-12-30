/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Neutral colors
        black: 'var(--color-black)',
        white: 'var(--color-white)',
        dark: {
          DEFAULT: 'var(--color-dark)',
          lighter: 'var(--color-dark-lighter)',
          light: 'var(--color-dark-light)',
        },

        // Gray scale
        gray: {
          50: 'var(--color-gray-50)',
          100: 'var(--color-gray-100)',
          200: 'var(--color-gray-200)',
          300: 'var(--color-gray-300)',
          400: 'var(--color-gray-400)',
          500: 'var(--color-gray-500)',
          600: 'var(--color-gray-600)',
          700: 'var(--color-gray-700)',
          800: 'var(--color-gray-800)',
          900: 'var(--color-gray-900)',
          950: 'var(--color-gray-950)',
        },

        // Vibrant accent colors
        violet: {
          50: 'var(--color-violet-50)',
          100: 'var(--color-violet-100)',
          200: 'var(--color-violet-200)',
          300: 'var(--color-violet-300)',
          400: 'var(--color-violet-400)',
          500: 'var(--color-violet-500)',
          600: 'var(--color-violet-600)',
          700: 'var(--color-violet-700)',
          800: 'var(--color-violet-800)',
          900: 'var(--color-violet-900)',
        },

        indigo: {
          50: 'var(--color-indigo-50)',
          100: 'var(--color-indigo-100)',
          200: 'var(--color-indigo-200)',
          300: 'var(--color-indigo-300)',
          400: 'var(--color-indigo-400)',
          500: 'var(--color-indigo-500)',
          600: 'var(--color-indigo-600)',
          700: 'var(--color-indigo-700)',
          800: 'var(--color-indigo-800)',
          900: 'var(--color-indigo-900)',
        },

        rose: {
          50: 'var(--color-rose-50)',
          100: 'var(--color-rose-100)',
          200: 'var(--color-rose-200)',
          300: 'var(--color-rose-300)',
          400: 'var(--color-rose-400)',
          500: 'var(--color-rose-500)',
          600: 'var(--color-rose-600)',
          700: 'var(--color-rose-700)',
          800: 'var(--color-rose-800)',
          900: 'var(--color-rose-900)',
        },

        cyan: {
          50: 'var(--color-cyan-50)',
          100: 'var(--color-cyan-100)',
          200: 'var(--color-cyan-200)',
          300: 'var(--color-cyan-300)',
          400: 'var(--color-cyan-400)',
          500: 'var(--color-cyan-500)',
          600: 'var(--color-cyan-600)',
          700: 'var(--color-cyan-700)',
          800: 'var(--color-cyan-800)',
          900: 'var(--color-cyan-900)',
        },

        amber: {
          50: 'var(--color-amber-50)',
          100: 'var(--color-amber-100)',
          200: 'var(--color-amber-200)',
          300: 'var(--color-amber-300)',
          400: 'var(--color-amber-400)',
          500: 'var(--color-amber-500)',
          600: 'var(--color-amber-600)',
          700: 'var(--color-amber-700)',
          800: 'var(--color-amber-800)',
          900: 'var(--color-amber-900)',
        },

        // Primary theme colors
        primary: {
          DEFAULT: 'var(--color-primary)',
          light: 'var(--color-primary-light)',
          dark: 'var(--color-primary-dark)',
        },

        secondary: {
          DEFAULT: 'var(--color-secondary)',
          light: 'var(--color-secondary-light)',
          dark: 'var(--color-secondary-dark)',
        },

        accent: {
          DEFAULT: 'var(--color-accent)',
          light: 'var(--color-accent-light)',
          dark: 'var(--color-accent-dark)',
        },

        // Semantic colors
        success: {
          DEFAULT: 'var(--color-success)',
          light: 'var(--color-success-light)',
          dark: 'var(--color-success-dark)',
        },

        warning: {
          DEFAULT: 'var(--color-warning)',
          light: 'var(--color-warning-light)',
          dark: 'var(--color-warning-dark)',
        },

        error: {
          DEFAULT: 'var(--color-error)',
          light: 'var(--color-error-light)',
          dark: 'var(--color-error-dark)',
        },

        info: {
          DEFAULT: 'var(--color-info)',
          light: 'var(--color-info-light)',
          dark: 'var(--color-info-dark)',
        },
      },

      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-secondary': 'var(--gradient-secondary)',
        'gradient-accent': 'var(--gradient-accent)',
        'gradient-sunset': 'var(--gradient-sunset)',
        'gradient-ocean': 'var(--gradient-ocean)',
        'gradient-dark': 'var(--gradient-dark)',
        'gradient-light': 'var(--gradient-light)',
      },

      opacity: {
        '5': 'var(--opacity-5)',
        '15': 'var(--opacity-15)',
      },
    },
  },
  plugins: [],
};

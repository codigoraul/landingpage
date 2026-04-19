/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        // Paleta original de la landing conservada
        brand: {
          50: '#e8efff',
          100: '#c5d3ff',
          200: '#9fb7ff',
          300: '#7a9aff',
          400: '#567dff',
          500: '#2b59ff', // accent principal
          600: '#2d5cc8',
          700: '#1a3cc9',
          800: '#0d2a8a',
          900: '#001A3D', // heading color
        },
        accent: {
          DEFAULT: '#2b59ff',
          hover: '#1a3cc9',
          soft: '#4379dc',
          aqua: '#79D8DF',
        },
        ink: {
          DEFAULT: '#001A3D',
          soft: '#433A44',
          muted: '#666666',
        },
        cta: {
          whatsapp: '#25D366',
          whatsappDark: '#22c15e',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Fira Sans"', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'hero': ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1.15', fontWeight: '700' }],
        'section-title': ['clamp(1.75rem, 3.5vw, 2.5rem)', { lineHeight: '1.2', fontWeight: '700' }],
      },
      maxWidth: {
        '8xl': '88rem',
      },
      boxShadow: {
        card: '0 5px 15px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 25px rgba(0, 0, 0, 0.1)',
        float: '0 4px 20px rgba(0, 0, 0, 0.1)',
        cta: '0 4px 15px rgba(76, 87, 253, 0.3)',
      },
      animation: {
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'pulse-soft': 'pulseSoft 2s infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 4px 10px rgba(0,0,0,0.3)' },
          '70%': { transform: 'scale(1.05)', boxShadow: '0 6px 15px rgba(0,0,0,0.4)' },
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #79D8DF 0%, #FFFFFF 100%)',
        'price-gradient': 'linear-gradient(135deg, #4379dc 0%, #2d5cc8 100%)',
      },
    },
  },
  plugins: [],
};

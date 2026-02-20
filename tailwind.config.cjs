/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "380px",
      },
      colors: {
        black: "#000000",
        'bg-primary': '#000000',
        'bg-secondary': '#0d0d0d',
        'bg-tertiary': '#1a1a1a',
        'bg-elevated': '#252525',
        'accent-cyan': '#0a84ff',
        'accent-magenta': '#ff0080',
        'accent-orange': '#ff6b35',
        'text-primary': '#f5f5f7',
        'text-secondary': '#86868b',
        'text-tertiary': '#515154',
      },
      textColor: {
        lightGray: "#f5f5f7",
        primary: "#f5f5f7",
        secColor: "#86868b",
        navColor: "#86868b",
      },
      backgroundColor: {
        mainColor: "#f5f5f7",
        secondaryColor: "#ebebeb",
        blackOverlay: "rgba(0, 0, 0, 0.72)",
      },
      boxShadow: {
        glow: "0 4px 16px rgba(0, 0, 0, 0.3)",
        glowMagenta: "0 4px 16px rgba(0, 0, 0, 0.3)",
        glowLight: "0 4px 16px rgba(0, 0, 0, 0.1)",
        'neon': '0 6px 24px rgba(0, 0, 0, 0.4)',
        'neon-magenta': '0 6px 24px rgba(0, 0, 0, 0.4)',
        'card': '0 24px 48px rgba(0, 0, 0, 0.8)',
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'gradient-dark': 'linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 50%, #000000 100%)',
      },
      animation: {
        'shimmer': 'shimmer 3s infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
    },
    fontFamily: {
      nunito: ["Inter", "-apple-system", "BlinkMacSystemFont", "SF Pro Display", "sans-serif"],
      roboto: ["Inter", "-apple-system", "BlinkMacSystemFont", "SF Pro Display", "sans-serif"],
      robotoCondensed: ["Inter", "-apple-system", "BlinkMacSystemFont", "SF Pro Display", "sans-serif"],
      mono: ["SF Mono", "Monaco", "Consolas", "monospace"],
    },
  },
  plugins: [],
};

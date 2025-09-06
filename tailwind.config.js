/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        arabic: {
          gold: "#D4AF37",
          emerald: "#50C878",
          sapphire: "#0F52BA",
          ruby: "#E0115F",
          amber: "#FFBF00",
          turquoise: "#40E0D0",
        },
        level: {
          beginner: "#4CAF50",
          elementary: "#FF9800",
          intermediate: "#2196F3",
          advanced: "#9C27B0",
        },
        progress: {
          incomplete: "#E0E0E0",
          partial: "#FFC107",
          complete: "#4CAF50",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(0)" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0.3)", opacity: "0" },
          "50%": { transform: "scale(1.05)" },
          "70%": { transform: "scale(0.9)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        "pulse-success": {
          "0%, 100%": { backgroundColor: "#4CAF50" },
          "50%": { backgroundColor: "#66BB6A" },
        },
        "shake": {
          "0%, 100%": { transform: "translateX(0)" },
          "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-10px)" },
          "20%, 40%, 60%, 80%": { transform: "translateX(10px)" },
        },
        "glow": {
          "0%, 100%": { boxShadow: "0 0 5px rgba(212, 175, 55, 0.5)" },
          "50%": { boxShadow: "0 0 20px rgba(212, 175, 55, 0.8)" },
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out",
        "slide-in": "slide-in 0.3s ease-out",
        "bounce-in": "bounce-in 0.6s ease-out",
        "pulse-success": "pulse-success 1s ease-in-out infinite",
        "shake": "shake 0.5s ease-in-out",
        "glow": "glow 2s ease-in-out infinite",
      },
      fontFamily: {
        arabic: ['Amiri', 'Noto Sans Arabic', 'serif'],
        english: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'arabic-sm': ['1.125rem', { lineHeight: '1.75rem' }],
        'arabic-base': ['1.25rem', { lineHeight: '1.875rem' }],
        'arabic-lg': ['1.5rem', { lineHeight: '2.25rem' }],
        'arabic-xl': ['1.875rem', { lineHeight: '2.5rem' }],
        'arabic-2xl': ['2.25rem', { lineHeight: '3rem' }],
        'arabic-3xl': ['3rem', { lineHeight: '3.5rem' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      backgroundImage: {
        'arabic-pattern': "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23D4AF37\" fill-opacity=\"0.1\"%3E%3Cpath d=\"M30 30c0-16.569 13.431-30 30-30v60c-16.569 0-30-13.431-30-30z\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      boxShadow: {
        'arabic': '0 4px 14px 0 rgba(212, 175, 55, 0.15)',
        'level': '0 8px 25px -8px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 40px -10px rgba(0, 0, 0, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 2026 Dark Mode - Deep space with neon accents
        bg: {
          primary: '#0A0A0F',      // Deep space black
          secondary: '#12121A',    // Elevated surface
          surface: '#1A1A24',      // Card background
          elevated: '#22222E',     // Hover states
          glass: 'rgba(26, 26, 36, 0.8)', // Glass morphism
        },
        // Accent colors - Vibrant neon palette
        accent: {
          cyan: '#00F5FF',         // Primary action
          violet: '#8B5CF6',       // Secondary action
          rose: '#FF6B9D',         // Tertiary/alerts
          lime: '#84CC16',         // Success
          amber: '#F59E0B',        // Warning
        },
        // Text hierarchy
        text: {
          primary: '#F8FAFC',      // High contrast
          secondary: '#94A3B8',    // Medium contrast
          muted: '#64748B',        // Low contrast
          inverse: '#0A0A0F',      // On light backgrounds
        },
        // Category colors - Each category gets a signature color
        category: {
          places: '#3B82F6',       // Blue
          people: '#EC4899',       // Pink
          construction: '#F97316', // Orange
          instruments: '#8B5CF6',  // Violet
          wellbeing: '#10B981',    // Emerald
          body: '#EF4444',         // Red
          vehicles: '#6366F1',     // Indigo
          weather: '#0EA5E9',      // Sky
          habits: '#F59E0B',       // Amber
          love: '#F43F5E',         // Rose
        },
        // Borders and dividers
        border: {
          subtle: 'rgba(148, 163, 184, 0.1)',
          visible: 'rgba(148, 163, 184, 0.2)',
          accent: 'rgba(0, 245, 255, 0.3)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        '2xs': '0.625rem',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 245, 255, 0.3)',
        'glow-violet': '0 0 20px rgba(139, 92, 246, 0.3)',
        'glow-rose': '0 0 20px rgba(255, 107, 157, 0.3)',
      },
    },
  },
  plugins: [],
};

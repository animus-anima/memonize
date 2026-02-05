// Child-Friendly Gamified Learning Design System
// Warm, inviting colors with clear visual hierarchy for ages 8+

export const Colors = {
  // Background - Soft, warm dark that's easy on eyes (not harsh black)
  bgPrimary: '#1E1B2E',      // Soft purple-black (cozy, not scary)
  bgSecondary: '#252238',    // Slightly lighter
  bgSurface: '#2D2A42',      // Card backgrounds
  bgElevated: '#363352',     // Hover/active states
  bgGlass: 'rgba(45, 42, 66, 0.9)',

  // Primary Actions - Friendly, energetic colors
  accentPrimary: '#7C5CFF',   // Playful purple (main action)
  accentSecondary: '#FF6B9D', // Warm pink (secondary)
  accentSuccess: '#4ADE80',   // Bright green (correct/success)
  accentWarning: '#FBBF24',   // Sunny yellow (attention)
  accentInfo: '#38BDF8',      // Sky blue (info)
  accentCyan: '#22D3EE',      // Cyan for interactive elements
  accentLime: '#A3E635',      // Lime green for progress/active
  accentViolet: '#A78BFA',    // Violet for highlights
  accentAmber: '#F59E0B',     // Amber for hints/tips

  // Fun gradient stops for special elements
  gradientStart: '#7C5CFF',
  gradientEnd: '#FF6B9D',

  // Text - High contrast, readable
  textPrimary: '#FFFFFF',     // Pure white for best readability
  textSecondary: '#B8B5C8',   // Soft lavender-gray
  textMuted: '#8E8AA3',       // Muted purple-gray
  textInverse: '#1E1B2E',     // For light backgrounds
  textOnAccent: '#FFFFFF',    // White text on colored buttons

  // Category Colors - Bright, distinct, memorable for kids
  // Each category gets a fun, saturated color
  categoryPlaces: '#38BDF8',      // Sky blue - open spaces
  categoryPeople: '#F472B6',      // Bubblegum pink - friendly
  categoryConstruction: '#FB923C', // Orange - building blocks
  categoryInstruments: '#A78BFA',  // Lavender - musical
  categorySports: '#4ADE80',       // Mint green - active/healthy
  categoryBody: '#F87171',         // Coral red - body
  categoryVehicles: '#60A5FA',     // Bright blue - vehicles
  categoryWeather: '#22D3EE',      // Cyan - sky/weather
  categoryClothing: '#FBBF24',     // Golden yellow - clothing
  categoryCelebrations: '#FB7185', // Rose pink - celebrations

  // Borders - Visible but not harsh
  borderSubtle: 'rgba(124, 92, 255, 0.15)',
  borderVisible: 'rgba(124, 92, 255, 0.3)',
  borderAccent: 'rgba(124, 92, 255, 0.5)',

  // Semantic colors
  success: '#4ADE80',
  error: '#F87171',
  warning: '#FBBF24',
  info: '#38BDF8',

  // Special - Star/achievement gold
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
};

// Map category IDs to colors
export const CategoryColors: Record<string, string> = {
  places: Colors.categoryPlaces,
  people: Colors.categoryPeople,
  construction: Colors.categoryConstruction,
  instruments: Colors.categoryInstruments,
  sports: Colors.categorySports,
  body: Colors.categoryBody,
  vehicles: Colors.categoryVehicles,
  weather: Colors.categoryWeather,
  clothing: Colors.categoryClothing,
  celebrations: Colors.categoryCelebrations,
};

// Category emojis for visual recognition
export const CategoryEmojis: Record<string, string> = {
  places: '🗺️',
  people: '👨‍👩‍👧‍👦',
  construction: '🏗️',
  instruments: '🎵',
  sports: '⚽',
  body: '💪',
  vehicles: '🚗',
  weather: '🌤️',
  clothing: '👕',
  celebrations: '🎉',
};

export const theme = {
  colors: Colors,
  fontSizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 22,
    '2xl': 26,
    '3xl': 32,
    '4xl': 40,
    '5xl': 52,
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    sm: 10,
    md: 14,
    lg: 18,
    xl: 24,
    '2xl': 32,
    full: 9999,
  },
};

const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Ensure proper module resolution for web
config.resolver.sourceExts = [...(config.resolver.sourceExts || []), "mjs", "cjs"];

// Disable Hermes for web to avoid import.meta issues
config.transformer = {
  ...config.transformer,
  getTransformOptions: async () => ({
    transform: {
      experimentalImportSupport: false,
      inlineRequires: true,
    },
  }),
};

// Polyfill import.meta for web compatibility (needed for Zustand devtools)
config.serializer = {
  ...config.serializer,
  getPolyfills: () => {
    const polyfills = require("@react-native/js-polyfills")();
    return polyfills;
  },
};

module.exports = withNativeWind(config, { input: "./global.css" });

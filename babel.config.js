module.exports = function (api) {
  api.cache(true);
  
  // Custom plugin to transform import.meta.env for web compatibility
  const importMetaPlugin = {
    visitor: {
      MetaProperty(path) {
        // Transform import.meta.env.X to process.env.X or a global
        if (
          path.node.meta.name === 'import' &&
          path.node.property.name === 'meta'
        ) {
          // Check if it's import.meta.env
          const parent = path.parentPath;
          if (
            parent.isMemberExpression() &&
            parent.node.property.name === 'env'
          ) {
            // Replace import.meta.env with { MODE: 'development', DEV: true, PROD: false }
            const grandparent = parent.parentPath;
            if (grandparent.isMemberExpression()) {
              const envKey = grandparent.node.property.name;
              if (envKey === 'MODE') {
                grandparent.replaceWithSourceString("(typeof __DEV__ !== 'undefined' && __DEV__ ? 'development' : 'production')");
              } else if (envKey === 'DEV') {
                grandparent.replaceWithSourceString("(typeof __DEV__ !== 'undefined' && __DEV__)");
              } else if (envKey === 'PROD') {
                grandparent.replaceWithSourceString("(typeof __DEV__ === 'undefined' || !__DEV__)");
              }
            } else {
              // Just import.meta.env without a property access
              parent.replaceWithSourceString("({ MODE: typeof __DEV__ !== 'undefined' && __DEV__ ? 'development' : 'production', DEV: typeof __DEV__ !== 'undefined' && __DEV__, PROD: typeof __DEV__ === 'undefined' || !__DEV__ })");
            }
          } else {
            // Just import.meta without .env
            path.replaceWithSourceString("({ env: { MODE: typeof __DEV__ !== 'undefined' && __DEV__ ? 'development' : 'production', DEV: typeof __DEV__ !== 'undefined' && __DEV__, PROD: typeof __DEV__ === 'undefined' || !__DEV__ } })");
          }
        }
      },
    },
  };

  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
    ],
    plugins: [
      importMetaPlugin,
      "react-native-reanimated/plugin",
    ],
  };
};


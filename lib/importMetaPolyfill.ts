// Polyfill for import.meta.env to fix Zustand and other libraries
// that use import.meta.env for environment detection
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.importMetaEnv = {
    MODE: __DEV__ ? 'development' : 'production',
    DEV: __DEV__,
    PROD: !__DEV__,
  };
}

export {};

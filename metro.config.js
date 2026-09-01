const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for .mjs and .cjs files
config.resolver.sourceExts = Array.from(
  new Set([...config.resolver.sourceExts, 'mjs', 'cjs'])
);

config.resolver.unstable_enablePackageExports = true;

module.exports = config;

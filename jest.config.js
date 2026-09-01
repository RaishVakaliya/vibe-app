/** @type {import('jest').Config} */
const config = {
  preset: 'jest-expo',
  testMatch: ['**/__tests__/**/*.(test|spec).[jt]s?(x)'],
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/core/$1',
    '^@domain/(.*)$': '<rootDir>/src/domain/$1',
    '^@data/(.*)$': '<rootDir>/src/data/$1',
    '^@presentation/(.*)$': '<rootDir>/src/presentation/$1',
  },
  transformIgnorePatterns: [
    'node_modules[\\\\/](?!(jest-expo|expo-modules-core|expo|@expo|react-native|@react-native|@react-navigation|react-native-reanimated|react-native-gesture-handler|react-native-safe-area-context|@shopify)[\\\\/])',
  ],
  setupFiles: ['<rootDir>/jest.setup.js'],
};

module.exports = config;

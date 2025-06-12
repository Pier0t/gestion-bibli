module.exports = {
  preset: 'expo-jest',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!(expo|react-native|@react-native|@expo)/)'
  ]
};

global.__DEV__ = true;

// Mock the ReactNative global namespace
global.ReactNative = {
  NativeModules: {},
};

// Mock Expo modules that might be used in tests
jest.mock('expo-font', () => ({
  loadAsync: jest.fn(() => Promise.resolve()),
}));

jest.mock('expo-asset', () => ({
  Asset: {
    loadAsync: jest.fn(() => Promise.resolve()),
  },
})); 
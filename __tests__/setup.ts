import '@testing-library/jest-native/extend-expect';
import { cleanup } from '@testing-library/react-native';
import { Alert } from 'react-native';

// Mock Ionicons
jest.mock('@expo/vector-icons/Ionicons', () => 'Icon');

// Mock dependencies
jest.mock('@clerk/clerk-expo', () => ({
  useSignUp: () => ({
    isLoaded: true,
  }),
  useSSO: () => ({
    startSSOFlow: jest.fn(),
  }),
  isClerkAPIResponseError: jest.fn(),
  useLocalCredentials: () => ({
    hasCredentials: false,
    setCredentials: jest.fn(),
    authenticate: jest.fn(),
    biometricType: null,
  }),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock('expo-auth-session', () => ({
  makeRedirectUri: () => 'mock-redirect-uri',
}));

// Mock Alert.alert
jest.spyOn(Alert, 'alert').mockImplementation(() => {});

// Clean up after each test
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
}); 
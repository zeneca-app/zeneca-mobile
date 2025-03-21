# Authentication Route Testing Guide

## Overview
This document outlines the testing strategy for authentication routes in the Zeneca Mobile application. The focus is on ensuring proper route protection, authentication flows, and user state management.

## Test Environment Setup

### Required Dependencies
```bash
npm install --save-dev @testing-library/react-native @testing-library/jest-native jest-expo
```

### Jest Configuration
Create or update `jest.config.js`:

```javascript
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/app/$1',
  },
}
```

## Mock Setup

### Clerk Authentication Mock
```typescript
// __mocks__/@clerk/clerk-expo.ts
export const useAuth = jest.fn().mockReturnValue({
  isLoaded: true,
  isSignedIn: false,
});

export const ClerkProvider = ({ children }) => children;
```

### Expo Router Mocks
```typescript
// __mocks__/expo-router.ts
export const useRouter = jest.fn().mockReturnValue({
  replace: jest.fn(),
  push: jest.fn(),
});

export const useSegments = jest.fn().mockReturnValue(['']);

export const Stack = {
  Screen: () => null,
};
```

### UserStore Mock
```typescript
// __mocks__/@/storage.ts
export const useUserStore = jest.fn().mockReturnValue({
  user: null,
  setUser: jest.fn(),
});
```

## Test Categories

### 1. Route Protection Tests

#### Test Authentication Guards
```typescript
describe('Authentication Guards', () => {
  it('should redirect unauthenticated users to login', () => {
    // Test unauthenticated access to protected routes
  });

  it('should allow authenticated users to access protected routes', () => {
    // Test authenticated access to protected routes
  });
});
```

### 2. Authentication Flow Tests

#### Sign Up Flow
```typescript
describe('Sign Up Flow', () => {
  it('should navigate through the signup process', () => {
    // Test complete signup navigation flow
  });

  it('should handle email verification', () => {
    // Test verification route handling
  });
});
```

#### Login Flow
```typescript
describe('Login Flow', () => {
  it('should navigate to protected content after successful login', () => {
    // Test successful login navigation
  });

  it('should handle login errors appropriately', () => {
    // Test login error scenarios
  });
});
```

### 3. Route Segment Tests
```typescript
describe('Route Segments', () => {
  it('should detect authenticated group correctly', () => {
    // Test segment detection
  });

  it('should handle navigation based on segments', () => {
    // Test segment-based navigation
  });
});
```

## Example Test Implementation

Here's a complete example of testing the authentication guard:

```typescript
import { renderHook } from '@testing-library/react-hooks';
import { useAuth } from '@clerk/clerk-expo';
import { useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { useUserStore } from '@/storage';

describe('Authentication Guard', () => {
  it('redirects to lock screen when authenticated user accesses public route', () => {
    // Mock authenticated state
    (useAuth as jest.Mock).mockReturnValue({
      isLoaded: true,
      isSignedIn: true,
    });

    // Mock public route segment
    (useSegments as jest.Mock).mockReturnValue(['']);

    const router = { replace: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(router);

    // Render the guard effect
    renderHook(() => {
      const { isLoaded, isSignedIn } = useAuth();
      const segments = useSegments();
      const router = useRouter();

      useEffect(() => {
        if (!isLoaded) return;

        const inAuthGroup = segments[0] === '(authenticated)';
        
        if (isSignedIn && !inAuthGroup) {
          router.replace('/(authenticated)/modals/lock');
        }
      }, [isLoaded, isSignedIn, segments]);
    });

    // Assert redirect was called
    expect(router.replace).toHaveBeenCalledWith('/(authenticated)/modals/lock');
  });
});
```

## Test Coverage Goals

Aim for the following coverage metrics:
- Route Protection Logic: 100%
- Authentication Flows: 90%
- Navigation Functions: 85%
- Error Handlers: 90%

## Running Tests

Run tests using:
```bash
npm test
```

For watching mode:
```bash
npm test -- --watch
```

For coverage report:
```bash
npm test -- --coverage
```

## Best Practices

1. Always mock external dependencies
2. Test both success and failure scenarios
3. Ensure proper cleanup after each test
4. Use meaningful test descriptions
5. Group related tests together
6. Keep tests focused and atomic

## Common Issues and Solutions

### 1. Clerk Authentication State
- Always ensure proper mocking of Clerk's authentication state
- Reset mocks between tests
- Test both loaded and loading states

### 2. Route Navigation
- Mock router functions properly
- Verify navigation calls with correct parameters
- Test navigation guards thoroughly

### 3. Async Operations
- Use proper async/await patterns
- Handle promises correctly
- Test loading states

## Maintenance

- Update tests when adding new routes
- Review test coverage regularly
- Update mocks when dependencies change
- Keep documentation current with testing strategy changes 
# Product Requirements Document (PRD): Authentication Flow

## 1. Overview

### 1.1 Purpose

The Authentication Flow is designed to provide a secure, user-friendly, and seamless onboarding and login experience for users of the mobile application. It supports multiple authentication methods (Email and Google OAuth) and ensures proper navigation to authenticated sections of the app upon successful login or signup.

### 1.2 Goals

- Enable users to sign up or log in using their email or Google account
- Provide a simple and intuitive interface for authentication
- Ensure secure handling of authentication via Clerk (authentication service)
- Seamlessly integrate with the app's backend to create or fetch user data
- Navigate users to the authenticated home screen upon successful authentication

### 1.3 Target Audience

- New users who need to create an account
- Returning users who want to log in to access the app

## 2. Current State

### 2.1 Existing Authentication Screens

The current implementation includes the following screens:

- `index.tsx` (WelcomeScreen): The landing page with "Sign Up" and "Sign In" buttons
- `signup.tsx` (SignUp): Signup options screen offering Email and Google OAuth methods
- `login.tsx` (Login): Login options screen offering Email and Google OAuth methods
- `email-signup.tsx` (EmailSignUp): Screen for entering an email address during signup
- `verify/[email].tsx` (VerifyEmail): Screen for OTP verification after email entry

### 2.2 Authentication Flow Overview

#### Initial Entry Point (index.tsx):

- Users see the WelcomeScreen and choose between "Sign Up" or "Sign In"

#### Login/Signup Options (login.tsx, signup.tsx):

- Users select either Email or Google OAuth as their authentication method

#### Google OAuth Flow:

- Clerk handles Google OAuth authentication
- Upon success, the backend creates or fetches the user, and the app navigates to (main)/home

#### Email Flow:

- Users enter their email in email-signup.tsx
- Users verify their email via OTP in verify/[email].tsx
- Upon success, the backend creates or fetches the user, and the app navigates to (main)/home

## 3. Requirements

### 3.1 Functional Requirements

#### 3.1.1 Welcome Screen (index.tsx)

**Purpose**: Serve as the entry point to the authentication flow.

**Features**:

- Display app branding (logo, gradient circle, description)
- Provide two buttons: "Sign Up" and "Sign In"
- Navigate to signup.tsx when "Sign Up" is clicked
- Navigate to login.tsx when "Sign In" is clicked

**UI Elements**:

- Logo (SVG)
- Gradient circle (SVG)
- App description text (translated via react-i18next)
- Two buttons (Button component)

**Behavior**:

- No authentication logic; purely navigational

#### 3.1.2 Sign Up Options Screen (signup.tsx)

**Purpose**: Allow users to choose their signup method.

**Features**:

- Offer two signup options: Email and Google OAuth
- Handle loading states for each option
- Navigate to email-signup.tsx for email signup
- Initiate Google OAuth flow via Clerk and navigate to (main)/home upon success

**UI Elements**:

- Header text (translated)
- Two LoginButton components (Email and Google)
- Footer text with terms link (translated)

**Behavior**:

- Disable buttons during loading or if Clerk is not loaded
- Show error alerts for failed attempts

#### 3.1.3 Login Options Screen (login.tsx)

**Purpose**: Allow users to choose their login method.

**Features**:

- Offer two login options: Email and Google OAuth
- Handle loading states for each option
- Navigate to /email-login for email login
- Initiate Google OAuth flow via Clerk and navigate to (main)/home upon success

**UI Elements**:

- Header text ("Iniciar sesión," translated)
- Two LoginButton components (Email and Google)
- Footer text with terms link (translated)

**Behavior**:

- Disable buttons during loading or if Clerk is not loaded
- Show error alerts for failed attempts

#### 3.1.4 Email Signup Screen (email-signup.tsx)

**Purpose**: Collect and validate the user's email for signup.

**Features**:

- Input field for email entry
- Validate email format using regex
- Initiate signup with Clerk and trigger email verification
- Navigate to verify/[email] upon successful email submission

**UI Elements**:

- Header text (translated)
- Email input field (TextInput)
- Validation error message (if applicable)
- "Continue" button (Button component)

**Behavior**:

- Disable button if email is invalid, empty, or during loading
- Show loading indicator during submission
- Display Clerk API errors via Alert

#### 3.1.5 Email Verification Screen (verify/[email].tsx)

**Purpose**: Verify the user's email via OTP.

**Features**:

- Display the email being verified
- Accept a 6-digit OTP code
- Automatically verify the code when 6 digits are entered
- Support both signup and sign-in flows (determined by signin param)
- Navigate to (main)/home upon successful verification

**UI Elements**:

- Header text (translated)
- Subtitle with email (translated)
- 6-cell OTP input field (CodeField)
- "Continue" button (LoginButton)

**Behavior**:

- Auto-submit OTP when 6 digits are entered
- Disable button if code length < 6
- Show Clerk API errors via Alert

#### 3.1.6 Root Layout (RootLayout) and Navigation

**Purpose**: Manage authentication state and navigation.

**Features**:

- Use Clerk to check if the user is signed in (useAuth)
- Redirect unauthenticated users from authenticated routes to the welcome screen
- Redirect authenticated users to (main)/modals/lock if not already in an authenticated route
- Load fonts and hide splash screen when ready

**Behavior**:

- Show IntroAnimation during loading
- Define stack navigation for all auth screens

### 3.2 Non-Functional Requirements

- **Performance**: Authentication requests should complete within 2 seconds under normal network conditions
- **Security**: Use Clerk's secure authentication APIs and token caching (tokenCache)
- **Accessibility**: Support screen readers and keyboard navigation for all inputs
- **Localization**: All text must be translatable via react-i18next
- **Error Handling**: Gracefully handle network errors, invalid inputs, and Clerk API errors with user-friendly messages

## 4. User Flows

### 4.1 New User Signup (Email)

1. User lands on WelcomeScreen → Clicks "Sign Up"
2. Navigates to SignUp → Selects "Email"
3. Navigates to EmailSignUp → Enters email → Clicks "Continue"
4. Navigates to VerifyEmail → Enters OTP → Auto-submits when complete
5. Backend creates user → Navigates to (main)/home

### 4.2 New User Signup (Google OAuth)

1. User lands on WelcomeScreen → Clicks "Sign Up"
2. Navigates to SignUp → Selects "Google"
3. Clerk initiates OAuth → Backend creates user → Navigates to (main)/home

### 4.3 Returning User Login (Email)

1. User lands on WelcomeScreen → Clicks "Sign In"
2. Navigates to Login → Selects "Email"
3. Navigates to /email-login → Enters email → Proceeds to OTP
4. Navigates to VerifyEmail → Enters OTP → Auto-submits when complete
5. Backend fetches user → Navigates to (main)/home

### 4.4 Returning User Login (Google OAuth)

1. User lands on WelcomeScreen → Clicks "Sign In"
2. Navigates to Login → Selects "Google"
3. Clerk initiates OAuth → Backend fetches user → Navigates to (main)/home

## 5. Technical Requirements

### 5.1 Dependencies

- **Clerk** (@clerk/clerk-expo): For authentication (Email, Google OAuth)
- **Expo Router**: For navigation
- **React Native**: Core framework
- **react-i18next**: For localization
- **react-native-confirmation-code-field**: For OTP input
- **Wagmi, Sentry, PostHog**: For additional app functionality

### 5.2 Backend Integration

- **User Creation**: After successful Clerk authentication (Email OTP or Google OAuth), call the backend to create a user if they don't exist
- **User Fetch**: After successful login, fetch user data from the backend

### 5.3 Navigation Stack

- Define routes: index, signup, login, email-signup, verify/[email], (main)
- Use screenConfigs for consistent header/no-header behavior

## 6. Success Metrics

- **User Adoption**: 90% of new users complete signup within the first session
- **Error Rate**: Less than 1% of authentication attempts fail due to app errors
- **Time to Authenticate**: Average time from welcome screen to authenticated home screen < 10 seconds

## 7. Future Considerations

- Add support for additional OAuth providers (e.g., Apple, Facebook)
- Implement password-based login as an alternative to OTP
- Enhance error recovery (e.g., resend OTP option on VerifyEmail)

### 8. Implementation Status

#### ✅ Completed Features

1. **Screen Implementation**

- ✅ WelcomeScreen (`index.tsx`)
  - Branding elements (logo, gradient circle)
  - Sign Up and Sign In navigation buttons
  - Translations implemented
- ✅ SignUp Screen (`signup.tsx`)
  - Email and Google OAuth options
  - Loading states
  - Terms text and link
- ✅ Login Screen (`login.tsx`)
  - Email and Google OAuth options
  - Loading states
  - Terms text and link
- ✅ Email Signup Screen (`email-signup.tsx`)
  - Email validation
  - Error handling
  - Loading states
- ✅ Email Verification Screen (`verify/[email].tsx`)
  - 6-digit OTP input
  - Auto-submission
  - Loading states
  - Error handling

2. **Authentication Features**

- ✅ Multiple Authentication Methods
  - Email with OTP verification
  - Google OAuth integration
- ✅ State Management
  - Auth store with Zustand
  - User store with persistence
  - Loading and error states

3. **Navigation**

- ✅ Route Configuration
  - Stack navigation
  - Screen configurations
  - Protected routes

4. **Error Handling**

- ✅ Comprehensive error management
  - User-friendly error messages
  - Retry mechanisms
  - Error state management

5. **User Flow**

- ✅ Onboarding Integration
  - Navigation to onboarding after successful auth
  - KYC flow
  - Success screens

#### 🔄 In Progress/Partially Implemented

1. **Security Features**

- 🔄 PIN Setup and Lock Screen
  - Basic implementation present
  - Security patterns under review

2. **User Experience**

- 🔄 Loading States
  - Basic implementation present
  - Visual feedback enhancements needed

#### ⏳ Pending Requirements

1. **Additional OAuth Providers**

- ⏳ Apple Sign In

1. **Enhanced Error Recovery**

- ⏳ Resend OTP option
- ⏳ More detailed error messages

3. **Performance Optimizations**

- ⏳ Authentication requests completion time monitoring
- ⏳ Token caching optimization

#### 📊 Success Metrics Implementation

1. **User Adoption Tracking**

- ⏳ Analytics implementation for signup completion rate
- ⏳ Time to authenticate measurement

2. **Error Rate Monitoring**

- ⏳ Error tracking implementation
- ⏳ Performance monitoring

## 9. Testing Plan

### 9.1 Unit Tests

#### Authentication Hook Tests (`hooks/userAuth.ts`)
- ✓ Test initialization of useAuth hook
- ✓ Test Google authentication methods
  - Success flow
  - Error handling
  - Loading states
- ✓ Test email authentication methods
  - Email validation
  - OTP verification
  - Error scenarios
- ✓ Test logout functionality
- ✓ Test retry mechanisms

#### Store Tests
- ✓ Test AuthStore state management
  - Initial state
  - State transitions
  - Action handlers
- ✓ Test UserStore operations
  - User data persistence
  - State updates
  - Error handling

### 9.2 Integration Tests

#### Screen Flow Tests
1. **Welcome Screen**
   - ✓ Navigation to signup
   - ✓ Navigation to login
   - ✓ UI elements rendering

2. **Signup Flow**
   - ✓ Email signup path
     - Email validation
     - OTP screen navigation
     - Success navigation
   - ✓ Google OAuth path
     - OAuth modal
     - Success/failure handling
     - Redirect behavior

3. **Login Flow**
   - ✓ Email login path
     - Email validation
     - OTP verification
     - Session creation
   - ✓ Google OAuth login
     - Authentication process
     - User data fetching
     - Redirect handling

4. **Verification Flow**
   - ✓ OTP input handling
   - ✓ Auto-submission
   - ✓ Resend functionality
   - ✓ Error scenarios

### 9.3 E2E Tests

#### Complete User Journeys with Maestro
1. **New User Registration**
   ```yaml
   # signup_flow.yaml
   appId: com.zeneca.mobile
   name: New User Email Signup Flow
   
   flow:
     - launchApp:
         clearState: true
     - tapOn:
         text: "Sign Up"
     - tapOn:
         text: "Continue with Email"
     - inputText:
         id: "email-input"
         text: "test@example.com"
     - tapOn:
         text: "Continue"
     - inputText:
         id: "otp-input"
         text: "123456"
     - assertVisible:
         text: "Welcome to Zeneca"
   ```

2. **Returning User Login**
   ```yaml
   # login_flow.yaml
   appId: com.zeneca.mobile
   name: Existing User Google Login Flow
   
   flow:
     - launchApp:
         clearState: true
     - tapOn:
         text: "Sign In"
     - tapOn:
         text: "Continue with Google"
     - runFlow:
         file: google_auth_subflow.yaml
     - assertVisible:
         text: "Welcome back"
   ```

3. **Authentication Error Handling**
   ```yaml
   # auth_errors.yaml
   appId: com.zeneca.mobile
   name: Authentication Error Scenarios
   
   flow:
     - launchApp:
         clearState: true
     - tapOn:
         text: "Sign Up"
     - tapOn:
         text: "Continue with Email"
     - inputText:
         id: "email-input"
         text: "invalid@email"
     - tapOn:
         text: "Continue"
     - assertVisible:
         text: "Please enter a valid email"
   ```

### 9.7 Test Environment Setup

#### Requirements
- Jest + React Native Testing Library
- Maestro for E2E testing
- Mock server for API responses
- Test data management

#### Jest Configuration and Mocks
```typescript
// jest.config.js
module.exports = {
  preset: 'jest-expo',
  setupFiles: ['./jest.setup.js'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@clerk|expo-secure-store)/)',
  ],
  setupFilesAfterEnv: ['@testing-library/jest-native/extend-expect'],
};

// jest.setup.js
import { mockExpoModules } from 'jest-expo';

// Mock Clerk native module
jest.mock('@clerk/clerk-expo', () => ({
  useAuth: () => ({
    isLoaded: true,
    isSignedIn: false,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  }),
  useUser: () => ({
    isLoaded: true,
    user: null,
  }),
  useSessionList: () => ({
    isLoaded: true,
    sessions: [],
  }),
}));

// Mock Expo SecureStore for token storage
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

// Mock navigation
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
}));

// Example of mocking native module calls
const mockNativeModules = {
  ExpoClipboard: {
    hasStringAsync: async () => false,
  },
};

Object.assign(mockExpoModules, mockNativeModules);
```

#### Example Test Implementation
```typescript
// __tests__/hooks/useAuth.test.ts
import { renderHook, act } from '@testing-library/react-native';
import { useAuth } from '@/hooks/userAuth';

describe('useAuth Hook', () => {
  it('should handle Google authentication', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      const response = await result.current.signInWithGoogle();
      expect(response.success).toBe(true);
    });
  });

  it('should handle email verification', async () => {
    const { result } = renderHook(() => useAuth());
    
    await act(async () => {
      const response = await result.current.verifyEmail('test@example.com', '123456', true);
      expect(response.success).toBe(true);
    });
  });
});
```

#### Phase 1: Setup & Configuration
- [x] 1.1 Basic Test Environment Setup
  ```bash
  # Core dependencies installed
  npm install --save-dev 
    @testing-library/react-native 
    @testing-library/jest-native 
    jest-expo
  ```
- [ ] 1.2 Additional Testing Tools
  ```bash
  # Need to install
  npm install --save-dev msw
  ```
- [x] 1.3 Jest Configuration
  - ✓ Basic Jest setup
  - [x] Configure mock for Clerk
  - [ ] Setup MSW for API mocking
  - [x] Mock native modules
- [x] 1.4 Mock Implementation
  - ✓ Authentication mocks
  - ✓ Navigation mocks
  - ✓ Storage mocks

#### Phase 2: Unit Tests Implementation
- [x] 2.1 Auth Hook Basic Tests
  ```typescript
  // Implemented in __tests__/hooks/useAuth.test.ts
  - ✓ Initial state tests
  - ✓ Basic auth method tests
  ```
- [ ] 2.2 Auth Hook Advanced Tests
  ```typescript
  // Need to implement
  - [ ] Google auth flow tests
  - [ ] Error handling scenarios
  - [ ] Loading state management
  ```
- [x] 2.3 Store Tests (Partial)
  ```typescript
  // Implemented in __tests__/storage/authStore.test.ts
  - ✓ Basic state management
  - ✓ Action handlers
  - [ ] Session persistence
  ```
- [ ] 2.4 Component Tests
  - [ ] WelcomeScreen
  - [ ] LoginButton
  - [ ] OTP input

#### Phase 3: Integration Tests
- [ ] 3.1 Screen Flow Tests
  ```typescript
  // Priority implementation needed
  describe('Authentication Flow', () => {
    test('completes email signup flow', async () => {});
    test('handles Google OAuth flow', async () => {});
    test('manages error states', async () => {});
  });
  ```
- [ ] 3.2 Navigation Tests
  - [ ] Auth state navigation
  - [ ] Protected routes
  - [ ] Deep linking

#### Phase 4: E2E Tests (High Priority)
- [ ] 4.1 Setup E2E Environment
  ```bash
  # Maestro setup and configuration
  - [ ] Install Maestro CLI
  - [ ] Configure test directory structure
  - [ ] Setup base test flows
  ```
- [ ] 4.2 Critical Path Tests
  ```yaml
  # Priority Maestro flows to implement
  - [ ] Email signup journey (signup_flow.yaml)
  - [ ] Google login journey (login_flow.yaml)
  - [ ] Error recovery flows (error_handling.yaml)
  ```
- [ ] 4.3 Maestro CI Integration
  ```yaml
  # .github/workflows/e2e.yml
  - [ ] Setup Maestro in CI environment
  - [ ] Configure test execution
  - [ ] Generate and store test reports
  ```

#### Phase 5: Security & Performance (High Priority)
- [ ] 5.1 Security Tests
  ```typescript
  // Critical implementation needed
  test('token management', () => {});
  test('session handling', () => {});
  ```
- [ ] 5.2 Performance Tests
  - [ ] Response time monitoring
  - [ ] Memory profiling
  - [ ] Load testing

#### Phase 6: Accessibility & Localization
- [x] 6.1 Basic Accessibility
  - ✓ Screen reader labels
  - ✓ Basic navigation
- [ ] 6.2 Advanced Accessibility
  - [ ] Keyboard navigation
  - [ ] Focus management
- [x] 6.3 Localization
  - ✓ Translation coverage
  - ✓ RTL support

#### Phase 7: CI/CD Integration
- [x] 7.1 Basic CI Setup
  ```yaml
  # Implemented in .github/workflows/test.yml
  - ✓ Basic test workflow
  - ✓ Dependency installation
  - ✓ Test execution
  ```
- [ ] 7.2 Advanced CI Features
  - [ ] Coverage reporting
  - [ ] Performance metrics
  - [ ] E2E test integration

#### Phase 8: Documentation & Maintenance
- [x] 8.1 Basic Documentation
  - ✓ Test strategy
  - ✓ Setup guide
- [ ] 8.2 Advanced Documentation
  - [ ] Troubleshooting guide
  - [ ] Performance benchmarks
  - [ ] Security guidelines

### Updated Dependencies and Prerequisites
1. Development Environment (✓ Installed)
   - ✓ Node.js 16+
   - ✓ React Native CLI
   - ✓ Xcode (iOS)
   - ✓ Android Studio
   - [ ] Maestro CLI
   
2. Testing Tools
   - ✓ Jest
   - ✓ React Native Testing Library
   - [ ] Maestro (Pending)
   - [ ] MSW (Pending)

### Current Risks and Mitigation
1. **High Priority Risks**
   - 🔴 Missing E2E test coverage
   - 🔴 Incomplete security testing
   - 🟡 Limited performance metrics

2. **Action Items**
   - Prioritize E2E setup (Week 1-2)
   - Implement security tests (Week 2-3)
   - Setup performance monitoring (Week 3-4)

### Updated Success Criteria
- [x] Basic test infrastructure (70% complete)
- [ ] Critical path coverage (40% complete)
- [ ] E2E test suite (0% complete)
- [ ] Security compliance (30% complete)
- [x] CI integration (80% complete)

### Next Steps (Prioritized)
1. Complete E2E testing setup
2. Implement critical path tests
3. Add security test suite
4. Setup performance monitoring
5. Enhance documentation

### 9.10 Test Implementation Tasks

#### Phase 1: Setup & Configuration (Week 1) ✅
- [x] Basic test environment setup with Jest and React Native Testing Library
- [x] Configure Jest for React Native and Expo
- [x] Set up test utilities and mock functions
- [x] Configure test coverage reporting
- [x] Set up test watch mode and scripts

#### Phase 2: Unit Tests Implementation (Week 2) 🔄
- [x] Authentication Hook Tests
  - [x] Test initial state and loading states
  - [x] Test Google authentication (sign-in and sign-up)
  - [x] Test email authentication (sign-in and sign-up)
  - [x] Test email verification
  - [x] Test error handling
  - [x] Test logout functionality
- [ ] Store Tests
  - [ ] Test auth store state management
  - [ ] Test user store state management
  - [ ] Test store actions and side effects
- [ ] Component Tests
  - [ ] Test authentication forms
  - [ ] Test error displays
  - [ ] Test loading states
  - [ ] Test success states

#### Phase 3: Integration Tests (Week 3) ⏳
- [ ] Screen Flow Tests
  - [ ] Test navigation between auth screens
  - [ ] Test form submissions and responses
  - [ ] Test error recovery flows
- [ ] State Management Integration
  - [ ] Test store interactions
  - [ ] Test persistence layer
  - [ ] Test state rehydration

#### Phase 4: E2E Tests with Maestro (Week 4) ⏳
- [ ] E2E Environment Setup
  - [ ] Install and configure Maestro
  - [ ] Set up test flows directory structure
  - [ ] Configure CI for Maestro tests
- [ ] Critical Path Tests
  - [ ] Complete signup flow
  - [ ] Complete login flow
  - [ ] Email verification flow
  - [ ] Error handling flows

#### Phase 5: Security & Performance (Week 5) ⏳
- [ ] Security Tests
  - [ ] Test token management
  - [ ] Test session handling
  - [ ] Test secure storage
- [ ] Performance Tests
  - [ ] Test authentication response times
  - [ ] Test state updates performance
  - [ ] Test form submission performance

#### Phase 6: Accessibility & Localization (Week 6) ⏳
- [ ] Accessibility Tests
  - [ ] Test screen reader compatibility
  - [ ] Test keyboard navigation
  - [ ] Test color contrast
- [ ] Localization Tests
  - [ ] Test multiple languages
  - [ ] Test RTL support
  - [ ] Test date/time formats

#### Phase 7: CI/CD Integration (Week 7) 🔄
- [x] Basic CI Setup
  - [x] Configure test runners
  - [x] Set up test reporting
- [ ] Advanced CI Features
  - [ ] Configure parallel test execution
  - [ ] Set up test retries
  - [ ] Configure test artifacts storage

#### Phase 8: Documentation & Maintenance (Week 8) 🔄
- [x] Basic Documentation
  - [x] Test setup instructions
  - [x] Test running guidelines
- [ ] Advanced Documentation
  - [ ] Test patterns and best practices
  - [ ] Mocking strategies
  - [ ] Troubleshooting guide

### Dependencies and Prerequisites
- Jest and React Native Testing Library ✅
- Maestro for E2E testing ⏳
- CI/CD pipeline access ✅
- Test coverage tools ✅

### Current Risks and Mitigation
1. **Technical Risks**
   - Complex auth flows may require extensive mocking
   - Solution: Implemented comprehensive mocking strategy for auth services
   - E2E tests may be flaky in CI
   - Solution: Will implement retry mechanisms and stable selectors

2. **Timeline Risks**
   - E2E test setup may take longer than expected
   - Solution: Prioritized unit and integration tests first
   - Security testing may reveal issues requiring fixes
   - Solution: Early security review planned

### Updated Success Criteria
- [x] Unit test coverage > 80% for auth hook
- [ ] Integration test coverage > 70%
- [ ] E2E test coverage of critical paths
- [ ] All tests pass in CI
- [ ] Documentation is complete and up-to-date

### Next Steps
1. Complete store tests implementation
2. Begin component test implementation
3. Set up Maestro for E2E testing
4. Implement critical path E2E tests

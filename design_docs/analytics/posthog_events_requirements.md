# PostHog Analytics Implementation Requirements

## Overview

This document outlines the requirements for implementing PostHog analytics events throughout the Zeneca mobile application. The goal is to track user behavior and interactions to gain insights into app usage, identify pain points, and improve the overall user experience.

## Current Setup

- PostHog React Native SDK is already installed (`posthog-react-native` v3.3.6)
- PostHog Provider is configured in `src/components/Providers.tsx`
- Environment variables are set up in `.env` files:
  - `EXPO_PUBLIC_POSTHOG_API_KEY`
  - `EXPO_PUBLIC_POSTHOG_HOST`

## Implementation Requirements

### 1. Create Analytics Utility Module

Create a dedicated analytics utility module to standardize event tracking across the application:

```typescript
// src/utils/analytics.ts
import { PostHog } from 'posthog-react-native';
import { userStore } from '@/storage';

/**
 * Event categories for analytics tracking
 * Used to standardize event naming across the application
 */
export enum EventCategory {
  NAVIGATION = 'Navigation',
  AUTHENTICATION = 'Authentication',
  ONBOARDING = 'Onboarding',
  KYC = 'KYC',
  ETF = 'ETF',
  TRANSACTION = 'Transaction',
  DEPOSIT = 'Deposit',
  PROFILE = 'Profile',
  ERROR = 'Error',
}

// Debug mode for development
const isDebugMode = __DEV__;

// Singleton instance for analytics
let posthogInstance: PostHog | null = null;

/**
 * Initialize the PostHog instance
 * @param instance - PostHog instance
 */
export function initializeAnalytics(instance: PostHog) {
  posthogInstance = instance;
}

/**
 * Get user properties for analytics events
 * @returns User properties object
 */
function getUserProperties() {
  const user = userStore.getState().user;
  
  return user ? {
    userId: user.id,
    userEmail: user.email,
    hasCompletedKYC: !!user.account?.kyc_status,
    hasCompletedOnboarding: !!user.account?.ob_status,
  } : {};
}

/**
 * Check if analytics tracking is enabled
 * @returns Boolean indicating if tracking is enabled
 */
function isTrackingEnabled() {
  const settings = userStore.getState().settings;
  return !settings?.analyticsOptOut;
}

/**
 * Track an event with standardized naming and user context
 * @param eventName - Name of the event
 * @param category - Category of the event
 * @param properties - Additional properties to track
 */
export function trackEvent(
  eventName: string, 
  category: EventCategory,
  properties?: Record<string, any>
) {
  // Check if tracking is enabled
  if (!isTrackingEnabled()) {
    return;
  }
  
  // Standardize event naming
  const formattedEventName = `${category} - ${eventName}`;
  
  // Get user properties
  const userProperties = getUserProperties();
  
  const eventProperties = {
    ...userProperties,
    ...properties,
  };
  
  // Log events in development
  if (isDebugMode) {
    console.log(`[Analytics] ${formattedEventName}`, eventProperties);
  }
  
  // Track the event
  posthogInstance?.capture(formattedEventName, eventProperties);
}

/**
 * Helper for tracking screen views
 * @param screenName - Name of the screen
 * @param properties - Additional properties to track
 */
export function trackScreenView(screenName: string, properties?: Record<string, any>) {
  trackEvent('Screen View', EventCategory.NAVIGATION, {
    screen: screenName,
    ...properties,
  });
}

/**
 * Create a debounced version of the trackEvent function
 * @param trackFn - Original track function
 * @param delay - Debounce delay in ms
 * @returns Debounced track function
 */
export function debounceTrackEvent<T extends (...args: any[]) => void>(
  trackFn: T,
  delay = 500
): T {
  let timeoutId: NodeJS.Timeout;
  
  return ((...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      trackFn(...args);
    }, delay);
  }) as T;
}
```

### 2. Event Tracking Requirements by Category

#### 2.1 Navigation Events

Track when users navigate between screens:

- **Screen View**: When a user views a screen
  - Properties: `screen` (screen name)

Implementation approach:
- Integrate with React Navigation's navigation events
- Use navigation listeners in the navigation container

#### 2.2 Authentication Events

Track authentication-related events:

- **Login Attempt**: When a user attempts to log in
  - Properties: `method` (email, social, etc.), `success` (boolean)
- **Login Success**: When a user successfully logs in
  - Properties: `method` (email, social, etc.)
- **Login Error**: When a login attempt fails
  - Properties: `method` (email, social, etc.), `error` (error message)
- **Logout**: When a user logs out
- **Password Reset Request**: When a user requests a password reset
- **OTP Requested**: When an OTP is requested
- **OTP Validation**: When an OTP is validated
  - Properties: `success` (boolean)

#### 2.3 Onboarding Events

Track onboarding-related events:

- **Onboarding Started**: When a user starts the onboarding process
- **Onboarding Step Completed**: When a user completes an onboarding step
  - Properties: `step` (step name), `timeSpent` (time spent on step)
- **Onboarding Completed**: When a user completes the entire onboarding process
  - Properties: `totalTimeSpent` (total time spent on onboarding)
- **Onboarding Abandoned**: When a user abandons the onboarding process
  - Properties: `step` (step where abandoned), `timeSpent` (time spent before abandoning)

#### 2.4 KYC Events

Track KYC verification events:

- **KYC Started**: When a user starts the KYC process
- **KYC Step Completed**: When a user completes a KYC step
  - Properties: `step` (step name)
- **KYC Completed**: When a user completes the entire KYC process
  - Properties: `totalTimeSpent` (total time spent on KYC)
- **KYC Abandoned**: When a user abandons the KYC process
  - Properties: `step` (step where abandoned)
- **KYC Error**: When an error occurs during KYC
  - Properties: `step` (step where error occurred), `error` (error message)

#### 2.5 ETF Events

Track ETF-related events:

- **ETF Viewed**: When a user views an ETF
  - Properties: `etfId` (ETF ID), `etfName` (ETF name)
- **ETF Purchase Started**: When a user starts the ETF purchase process
  - Properties: `etfId` (ETF ID), `etfName` (ETF name), `amount` (purchase amount)
- **ETF Purchase Completed**: When a user completes an ETF purchase
  - Properties: `etfId` (ETF ID), `etfName` (ETF name), `amount` (purchase amount)
- **ETF Purchase Abandoned**: When a user abandons an ETF purchase
  - Properties: `etfId` (ETF ID), `etfName` (ETF name), `step` (step where abandoned)
- **ETF Sell Started**: When a user starts the ETF sell process
  - Properties: `etfId` (ETF ID), `etfName` (ETF name), `amount` (sell amount)
- **ETF Sell Completed**: When a user completes an ETF sell
  - Properties: `etfId` (ETF ID), `etfName` (ETF name), `amount` (sell amount)
- **ETF Sell Abandoned**: When a user abandons an ETF sell
  - Properties: `etfId` (ETF ID), `etfName` (ETF name), `step` (step where abandoned)

#### 2.6 Transaction Events

Track transaction-related events:

- **Transaction Started**: When a user starts a transaction
  - Properties: `type` (transaction type), `amount` (transaction amount)
- **Transaction Completed**: When a user completes a transaction
  - Properties: `type` (transaction type), `amount` (transaction amount), `timeToComplete` (time to complete)
- **Transaction Failed**: When a transaction fails
  - Properties: `type` (transaction type), `amount` (transaction amount), `error` (error message)
- **Quote Requested**: When a user requests a quote
  - Properties: `fromCurrency` (from currency), `toCurrency` (to currency), `amount` (amount)
- **Quote Accepted**: When a user accepts a quote
  - Properties: `fromCurrency` (from currency), `toCurrency` (to currency), `amount` (amount), `rate` (exchange rate)

#### 2.7 Deposit Events

Track deposit-related events:

- **Deposit Method Selected**: When a user selects a deposit method
  - Properties: `method` (deposit method)
- **Deposit Started**: When a user starts a deposit
  - Properties: `method` (deposit method), `amount` (deposit amount)
- **Deposit Completed**: When a user completes a deposit
  - Properties: `method` (deposit method), `amount` (deposit amount)
- **Deposit Failed**: When a deposit fails
  - Properties: `method` (deposit method), `amount` (deposit amount), `error` (error message)

#### 2.8 Profile Events

Track profile-related events:

- **Profile Viewed**: When a user views their profile
- **Profile Updated**: When a user updates their profile
  - Properties: `fields` (fields updated)
- **Settings Changed**: When a user changes settings
  - Properties: `setting` (setting changed), `value` (new value)

#### 2.9 Error Events

Track error events:

- **App Error**: When an app error occurs
  - Properties: `error` (error message), `screen` (screen where error occurred), `action` (action that caused error)
- **Network Error**: When a network error occurs
  - Properties: `endpoint` (API endpoint), `error` (error message)

### 3. Implementation Approach

#### 3.1 Screen View Tracking

Set up screen tracking at the navigation container level:

```typescript
// src/navigation/index.tsx
import { NavigationContainer } from '@react-navigation/native';
import { trackScreenView } from '@/utils/analytics';

export function AppNavigator() {
  const routeNameRef = React.useRef<string | undefined>();
  
  return (
    <NavigationContainer
      onReady={() => {
        routeNameRef.current = navigationRef.current?.getCurrentRoute()?.name;
      }}
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = navigationRef.current?.getCurrentRoute()?.name;
        
        if (currentRouteName && previousRouteName !== currentRouteName) {
          // Track screen view
          trackScreenView(currentRouteName);
          
          // Update the route name ref
          routeNameRef.current = currentRouteName;
        }
      }}
    >
      {/* Navigation structure */}
    </NavigationContainer>
  );
}
```

#### 3.2 Event Tracking in Components

Example of tracking an event in a component:

```typescript
// Example component
import { trackEvent, EventCategory } from '@/utils/analytics';

const LoginComponent = () => {
  const handleLogin = async (email: string, password: string) => {
    trackEvent('Login Attempt', EventCategory.AUTHENTICATION, { method: 'email' });
    
    try {
      // Login logic
      await login(email, password);
      
      trackEvent('Login Success', EventCategory.AUTHENTICATION, { method: 'email' });
    } catch (error) {
      trackEvent('Login Error', EventCategory.AUTHENTICATION, { 
        method: 'email',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
  
  // Component JSX
};
```

#### 3.3 Error Tracking

Implement global error tracking:

```typescript
// src/utils/errorTracking.ts
import { trackEvent, EventCategory } from '@/utils/analytics';
import * as Sentry from '@sentry/react-native';

/**
 * Track an error with PostHog and Sentry
 * @param error - Error object
 * @param context - Additional context for the error
 */
export function trackError(error: Error, context?: Record<string, any>) {
  // Track with PostHog
  trackEvent('App Error', EventCategory.ERROR, {
    error: error.message,
    stack: error.stack,
    ...context,
  });
  
  // Also track with Sentry for detailed error reporting
  Sentry.captureException(error, {
    extra: context,
  });
}
```

Create a global error boundary component:

```typescript
// src/components/ErrorBoundary/index.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { trackError } from '@/utils/errorTracking';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary component to catch and handle errors in the component tree
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Track the error
    trackError(error, { componentStack: errorInfo.componentStack });
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Render fallback UI if provided, otherwise render default error UI
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-lg font-bold mb-2">Something went wrong</Text>
          <Text className="text-sm mb-4">{this.state.error?.message}</Text>
          <Button title="Try again" onPress={this.resetError} />
        </View>
      );
    }

    return this.props.children;
  }
}
```

#### 3.4 Initializing Analytics

Initialize the analytics module in the app entry point:

```typescript
// src/components/Providers.tsx
import { PostHogProvider, usePostHog } from 'posthog-react-native';
import { initializeAnalytics } from '@/utils/analytics';

// Add this inside the Providers component
export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <GestureHandlerRootView className="flex-1 text-white font-sans">
      <PrivyProvider
        storage={MyPermissiveSecureStorageAdapter}
        appId={env.PRIVY_APP_ID}
        clientId={env.PRIVY_CLIENT_ID}
        supportedChains={[sepolia, baseSepolia, base]}
      >
        <PostHogProvider
          apiKey={env.POSTHOG_API_KEY}
          options={{
            host: env.POSTHOG_HOST,
          }}
        >
          <AnalyticsInitializer>
            {/* Rest of the providers */}
            {children}
          </AnalyticsInitializer>
        </PostHogProvider>
      </PrivyProvider>
    </GestureHandlerRootView>
  );
};

// Component to initialize analytics
function AnalyticsInitializer({ children }: { children: React.ReactNode }) {
  const posthog = usePostHog();
  
  // This is the only place where we need to use useEffect
  React.useEffect(() => {
    if (posthog) {
      initializeAnalytics(posthog);
    }
  }, [posthog]);
  
  return <>{children}</>;
}
```

### 4. Implementation Priority

Implement PostHog event tracking in the following order:

1. **High Priority**
   - Navigation/Screen Views
   - Authentication Events
   - Critical Error Events
   - KYC Events
   - Transaction Events

2. **Medium Priority**
   - Onboarding Events
   - ETF Events
   - Deposit Events

3. **Lower Priority**
   - Profile Events
   - Detailed Error Events
   - Performance Metrics

### 5. Testing and Validation

- Implement a debug mode for PostHog in development environments
- Create a testing plan to verify that events are being tracked correctly
- Set up PostHog dashboards to visualize and analyze the tracked events

### 6. Privacy Considerations

- Ensure that sensitive user information is not tracked
- Comply with privacy regulations (GDPR, CCPA, etc.)
- Implement opt-out mechanisms for analytics tracking if required

### 7. Performance Considerations

- Batch events when possible to reduce network requests
- Avoid tracking high-frequency events that could impact performance
- Use debouncing for events that might fire rapidly (e.g., text input changes)

## Next Steps

1. Create the analytics utility module
2. Implement screen view tracking at the navigation container level
3. Add event tracking to authentication flows
4. Gradually add event tracking to other parts of the application
5. Set up PostHog dashboards for analysis
6. Monitor and iterate based on the collected data

## Integration with Existing Architecture

- Ensure analytics functions are used consistently across the application
- Integrate with existing error handling mechanisms
- Coordinate with the Zustand stores for user context
- Follow the project's TypeScript and React best practices 
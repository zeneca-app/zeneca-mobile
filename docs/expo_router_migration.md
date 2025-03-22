# Expo Router Migration Guide

## Table of Contents
1. [Overview](#overview)
2. [Current Architecture](#current-architecture)
3. [Migration Plan](#migration-plan)
4. [Implementation Steps](#implementation-steps)
5. [Testing Strategy](#testing-strategy)
6. [Rollback Plan](#rollback-plan)

## Overview

This document outlines the migration process from React Navigation to Expo Router in the Zeneca Mobile application. The migration will improve our routing system by leveraging Expo Router's file-based routing approach while maintaining our current authentication and navigation features.

### Why Migrate to Expo Router?

- **File-based Routing**: Simpler, more intuitive routing structure
- **Better TypeScript Support**: Improved type safety and developer experience
- **Automatic Code-splitting**: Better performance and load times
- **Native Navigation Features**: Better integration with native platforms
- **Simplified Deep Linking**: Easier configuration and maintenance

### Impact Assessment

**Affected Areas**:
- Navigation structure
- Authentication flow
- Deep linking
- Screen transitions
- Route protection
- Navigation types

**Key Benefits**:
- More maintainable routing code
- Better developer experience
- Improved performance
- Simplified deep linking
- Better type safety

## Current Architecture

### Existing Navigation Structure

```
src/
├── screens/
│   ├── MainNavigation.tsx
│   ├── HomeScreen.tsx
│   ├── Login/
│   │   ├── Welcome.tsx
│   │   ├── LoginOptions.tsx
│   │   └── LoginOtpVerification.tsx
│   ├── Deposit/
│   ├── ETF/
│   └── KYC/
└── components/
    └── AwaitPrivyProvider.tsx
```

### Current Route Groups

1. **Home Screens**
   - Home
   - Profile
   - Order History

2. **Login Screens**
   - Welcome
   - Login Options
   - Email OTP Verification

3. **Deposit Screens**
   - Crypto Deposit
   - Bank Deposit

4. **ETF Screens**
   - ETF Detail
   - ETF Purchase
   - ETF Sell

5. **KYC Screens**
   - KYC Preview
   - KYC Provider
   - KYC Success

## Migration Plan

### Phase 1: Initial Setup

1. **Install Dependencies**
```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar react-native-gesture-handler
```

2. **Update Configuration**

package.json:
```json
{
  "main": "expo-router/entry",
  "dependencies": {
    "expo-router": "^3.0.0",
    "react-native-safe-area-context": "^4.8.0",
    "react-native-screens": "^3.29.0",
    "expo-linking": "^6.0.0",
    "expo-constants": "^15.0.0",
    "expo-status-bar": "^1.7.0",
    "react-native-gesture-handler": "^2.14.0"
  }
}
```

app.json:
```json
{
  "expo": {
    "scheme": "zeneca",
    "web": {
      "bundler": "metro"
    },
    "plugins": [
      "expo-router"
    ]
  }
}
```

### Phase 2: New File Structure

```
app/
├── (auth)/
│   ├── _layout.tsx
│   ├── home.tsx
│   ├── profile.tsx
│   ├── deposit/
│   │   ├── crypto.tsx
│   │   └── bank.tsx
│   ├── etf/
│   │   ├── detail.tsx
│   │   ├── purchase.tsx
│   │   ├── sell.tsx
│   │   └── _layout.tsx
│   └── order-history/
│       ├── index.tsx
│       └── [id].tsx
├── (public)/
│   ├── _layout.tsx
│   ├── index.tsx
│   └── login/
│       ├── _layout.tsx
│       ├── email.tsx
│       ├── otp.tsx
│       └── options.tsx
├── (kyc)/
│   ├── _layout.tsx
│   ├── preview.tsx
│   ├── provider.tsx
│   └── success.tsx
└── _layout.tsx
```

### Phase 3: Core Components

1. **Root Layout (_layout.tsx)**
```typescript
import { Stack } from 'expo-router';
import { AwaitPrivyProvider } from '@/components/AwaitPrivyProvider';

export default function RootLayout() {
  return (
    <AwaitPrivyProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AwaitPrivyProvider>
  );
}
```

2. **Auth Guard**
```typescript
import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { usePrivy } from '@privy-io/expo';
import { useUserStore } from '@/storage';

export function AuthGuard() {
  const { isReady: isPrivyReady, user: privyUser } = usePrivy();
  const { user } = useUserStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isPrivyReady) return;

    const inAuthGroup = segments[0] === '(auth)';
    const isAuthenticated = privyUser && user;

    if (isAuthenticated && !inAuthGroup) {
      router.replace('/(main)/');
    } else if (!isAuthenticated && inAuthGroup) {
      router.replace('/');
    }
  }, [isPrivyReady, privyUser, user, segments]);

  return null;
}
```

## Implementation Steps

### 1. Preparation

- [ ] Back up current navigation setup
- [ ] Install required dependencies
- [ ] Update configuration files
- [ ] Create new directory structure

### 2. Core Setup

- [ ] Create root layout
- [ ] Implement auth guard in the root layout
- [ ] Set up route groups
- [ ] Configure deep linking

### 3. Screen Migration

- [ ] Move public screens
- [ ] Move authenticated screens
- [ ] Update navigation calls
- [ ] Implement layouts

### 4. Authentication Flow

- [ ] Update AwaitPrivyProvider
- [ ] Implement route protection
- [ ] Update navigation logic
- [ ] Test authentication flow

### 5. Feature Migration

- [ ] Migrate ETF screens
- [ ] Migrate Deposit screens
- [ ] Migrate KYC screens
- [ ] Update deep linking

## Testing Strategy

### 1. Unit Tests

- [ ] Test auth guard functionality
- [ ] Test navigation helpers
- [ ] Test route protection
- [ ] Test deep linking

### 2. Integration Tests

- [ ] Test authentication flow
- [ ] Test protected routes
- [ ] Test navigation between screens
- [ ] Test deep linking

### 3. E2E Tests

- [ ] Test complete user flows
- [ ] Test authentication scenarios
- [ ] Test deep linking scenarios
- [ ] Test error scenarios

### 4. Performance Testing

- [ ] Measure initial load time
- [ ] Test navigation performance
- [ ] Monitor memory usage
- [ ] Check bundle size

## Rollback Plan

### Triggers for Rollback

- Critical bugs in production
- Significant performance issues
- Authentication flow failures
- Deep linking failures

### Rollback Steps

1. **Immediate Actions**
   - Switch back to backup branch
   - Deploy previous version
   - Notify team

2. **Recovery Steps**
   - Analyze failure points
   - Update migration plan
   - Fix identified issues
   - Plan new migration attempt

### Post-Rollback Analysis

- Document issues encountered
- Update migration plan
- Review testing strategy
- Plan next attempt

## Migration Checklist

### Pre-Migration
- [ ] Complete backup of current navigation
- [ ] Team notification and coordination
- [ ] Development environment setup
- [ ] Testing environment preparation

### During Migration
- [ ] Monitor error rates
- [ ] Track performance metrics
- [ ] Document any issues
- [ ] Regular testing

### Post-Migration
- [ ] Verify all features
- [ ] Performance validation
- [ ] User feedback collection
- [ ] Documentation update

## Notes

### Common Issues

1. **Navigation State**
   - Different API patterns
   - State persistence changes
   - Route parameter handling

2. **Authentication**
   - Protected route implementation
   - State management integration
   - Navigation guards

3. **Deep Linking**
   - Configuration differences
   - URL pattern changes
   - Parameter handling

### Best Practices

1. **Code Organization**
   - Keep layouts simple
   - Use route groups effectively
   - Maintain clear file structure

2. **Performance**
   - Implement lazy loading
   - Optimize transitions
   - Monitor bundle size

3. **Testing**
   - Regular integration testing
   - Performance monitoring
   - User flow validation

## Support and Resources

- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [Migration Guide](https://docs.expo.dev/router/migration/)
- [Examples Repository](https://github.com/expo/expo/tree/main/packages/expo-router/example)
- [Expo Discord Community](https://chat.expo.dev/)

## Implementation Progress

### Completed Steps

✅ Initial Setup
- Installed required dependencies
- Updated configuration files
- Created basic directory structure

✅ Core Setup
- Created root layout with Privy integration
- Implemented authentication guard
- Set up route groups
- Configured basic navigation

✅ Authentication Flow
- Integrated PrivyProvider
- Implemented route protection
- Set up navigation logic

### In Progress

🔄 Screen Migration
- [ ] Complete public screens
- [ ] Complete authenticated screens
- [ ] Update navigation calls
- [ ] Implement individual layouts

🔄 Feature Migration
- [ ] ETF screens
- [ ] Deposit screens
- [ ] KYC screens
- [ ] Deep linking

### Next Steps

1. **Screen Implementation**
   - Complete individual screen components
   - Add proper typings
   - Implement layouts for each route group

2. **Feature Integration**
   - Integrate ETF functionality
   - Set up deposit flows
   - Complete KYC integration

3. **Testing & Optimization**
   - Implement navigation testing
   - Optimize transitions
   - Test deep linking
   - Performance testing 
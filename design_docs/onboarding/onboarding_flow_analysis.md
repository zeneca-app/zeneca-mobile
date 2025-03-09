# Onboarding Flow Analysis

## Overview

This document provides a comprehensive analysis of the onboarding flow in the Zeneca mobile app, identifying potential bugs, issues, and areas for improvement. The analysis focuses specifically on the onboarding steps and KYC verification process.

## Flow Architecture

The onboarding process consists of the following key components:

1. **Entry Points**
   - VerifyCTACard (on HomeScreen) - Primary entry point for verification
   - KYCPreview - Introduction screen for the KYC process

2. **Onboarding Steps**
   - Full Name (first and last name)
   - Country Selection
   - Full Address (street, city, state, postal code)
   - KYC Verification (redirect to third-party provider)

3. **State Management**
   - User data (userStore)
   - KYC status (kycStatusStore)
   - Onboarding status (tracked in both stores)

## Detailed Architecture Analysis

### Component Structure

1. **Entry Point Components**
   - **VerifyCTACard.tsx**: Main entry point from HomeScreen that checks verification status and directs users to the appropriate step based on their current onboarding status
   - **KYCPreview.tsx**: Introduction screen that explains the KYC process to users before starting

2. **Core Components**
   - **OnBoarding.tsx**: Main orchestrator component that manages step progression, form state, and API calls
   - **Step Components**:
     - `FullNameStep.tsx`: Handles first and last name collection and validation
     - `CountryStep.tsx`: Manages country selection with dropdown interface
     - `FullAddressStep.tsx`: Collects and validates address information
     - `KYCRedirectStep.tsx`: Redirects to KYC provider for identity verification
   - **KYC Components**:
     - `KYCProvider.tsx`: Integrates with AiPrise third-party KYC service
     - `KYCSuccess.tsx`: Displays success message after KYC completion

3. **State Management**
   - **userStore.ts**: Zustand store that maintains user profile data including onboarding status
   - **kycStatusStore.ts**: Specialized store for tracking KYC verification status and onboarding status
   - **Form State**: Managed locally in the OnBoarding component with useState hooks

### Data Flow

1. **Complete Onboarding Flow Sequence**
   ```
   HomeScreen (VerifyCTACard) → KYCPreview → OnBoarding (FullNameStep → CountryStep → FullAddressStep) → KYCRedirectStep → KYCProvider → API → KYCSuccess
   ```

2. **Entry Point Logic**
   - VerifyCTACard checks the user's current onboarding status (`obStatus`) and navigates to the appropriate screen:
     - If `obStatus` is undefined or user account is undefined: Navigate to KYCPreview
     - If `obStatus` is "NAMES_STEP" or "COUNTRY_STEP": Navigate to OnBoarding
     - If `obStatus` is "ADDRESS_STEP": Navigate directly to KYCProvider
     - Default: Navigate to KYCPreview

3. **State Updates**
   - User completes a step → Form validation occurs → API mutation is called → Backend updates status → UI advances to next step
   - Current status is stored in `user.account.ob_status` and used to determine the active step
   - KYC status is tracked separately in the kycStatusStore with properties like `isVerifying` and `isVerified`

4. **Form Data Management**
   - Form values are maintained in the OnBoarding component's state
   - Each step component receives form values and handlers as props
   - Step components validate their specific fields and report validation status back to the parent

### API Integration

1. **API Mutation Structure**
   - The app uses TanStack Query (React Query) for API interactions
   - Mutations are centralized in `useOnboardingMutations.ts`
   - Key mutations:
     - `onboardingOnboardingNamesStepMutation`
     - `onboardingOnboardingCountryStepMutation`
     - `onboardingOnboardingAddressStepMutation`
     - `onboardingOnboardingKycStepMutation`

2. **Backend Constraints**
   - Backend enforces sequential progression through onboarding steps
   - Each step can only be completed after the previous step is confirmed
   - KYC step specifically requires ADDRESS_STEP status to be set

### Third-Party Integration

1. **AiPrise KYC Integration**
   - Integration via the `AiPriseFrame` component from `aiprise-react-native-sdk`
   - Configuration includes:
     - Client reference ID
     - Template ID
     - Country code for verification
     - UI theme customization
   - Events handled:
     - `onSuccess`: Triggers backend update
     - `onComplete`: Same as onSuccess
     - `onError`: Shows alert with error code

### Architectural Patterns

1. **Current Architecture**
   - Component-based architecture with React
   - Global state management with Zustand
   - Local form state with React hooks
   - API interactions with React Query
   - Navigation with React Navigation

2. **Architectural Strengths**
   - Clear separation of concerns between step components
   - Centralized form state management
   - Reusable form components
   - Persistent state with Zustand

3. **Architectural Weaknesses**
   - Lack of synchronization between API calls and UI transitions
   - Insufficient error handling and recovery mechanisms
   - No clear state machine for onboarding flow
   - Tight coupling between step progression and backend status
   - Race conditions between frontend navigation and backend state updates
   - Multiple entry points with inconsistent navigation logic

## Identified Issues

### Entry Point Issues

1. **VerifyCTACard Direct Navigation Issue**
   - **Problem**: When the user's status is "ADDRESS_STEP", the VerifyCTACard component navigates directly to the KYCProvider screen, bypassing the KYCRedirectStep. This could be contributing to the synchronization issue where the KYC step is attempted before the backend has fully updated the user's status.
   - **Impact**: Users face errors when trying to complete the KYC verification process.
   - **Code Location**: `src/screens/HomeScreen/components/VerifyCtaCard.tsx`
   ```typescript
   case "ADDRESS_STEP":
     navigation.navigate("KYCProvider", {
       country_code: user?.account?.country,
     });
     break;
   ```
   - **Recommendation**: Add a status check or introduce a delay/loading state to ensure the backend has fully updated the user's status before navigating to the KYCProvider.

2. **Status Synchronization Issue in VerifyCTACard**
   - **Problem**: The VerifyCTACard fetches the KYC status using React Query, but there's no mechanism to ensure that the status is up-to-date before navigating to the next step.
   - **Impact**: Navigation decisions might be made based on stale status data.
   - **Code Location**: `src/screens/HomeScreen/components/VerifyCtaCard.tsx`
   - **Recommendation**: Implement a loading state while fetching the status and disable navigation until the status is confirmed to be up-to-date.

3. **Error Handling Issues in VerifyCTACard**
   - **Problem**: While errors are captured with Sentry, there's no user-facing error handling or recovery mechanism if the status fetch fails.
   - **Impact**: Users might see a non-functional UI or face navigation issues if the status fetch fails.
   - **Code Location**: `src/screens/HomeScreen/components/VerifyCtaCard.tsx`
   - **Recommendation**: Add user-facing error messages and retry mechanisms for status fetch failures.

### Onboarding Flow Issues

1. **KYC Step Status Synchronization Issue**
   - **Problem**: The backend returns an error "KYC step can only be completed after address step" because the app is attempting to update the KYC step before the user's status has been properly updated to ADDRESS_STEP.
   - **Impact**: Users cannot complete the KYC verification process, blocking them from completing onboarding.
   - **Code Location**: `src/screens/KYCVerification/KYCProvider.tsx` and `src/components/Onboarding/KYCRedirectStep.tsx`
   - **Root Cause**: When the user completes the address step in `OnBoarding.tsx`, the app immediately navigates to the KYC provider screen without waiting for the backend to update the user's status. The KYC provider then tries to call the `/kyc-step` endpoint before the user's status has been updated to ADDRESS_STEP.
   - **Recommendation**: Add a status check and synchronization mechanism to ensure the backend has updated the user's status to ADDRESS_STEP before attempting to proceed to the KYC step. This could involve:
     1. Adding a loading state while waiting for the address step update to complete
     2. Fetching the latest user data before navigating to the KYC provider
     3. Adding retry logic if the status isn't updated yet

2. **KYCRedirectStep Navigation Issue**
   - **Problem**: In `KYCRedirectStep.tsx`, there's an immediate navigation to the KYCProvider screen when the component mounts, but there's no cleanup or handling if the navigation fails.
   - **Impact**: Users could get stuck in a loop or face a broken experience if the navigation fails.
   - **Code Location**: `src/components/Onboarding/KYCRedirectStep.tsx`
   ```typescript
   useEffect(() => {
     // Automatically navigate to KYC provider when this step is mounted
     navigation.navigate("KYCProvider", {
       country_code: formValues.country_code,
       full_address: {
         // address details...
       },
     });
   }, []);
   ```
   - **Recommendation**: Add error handling and a fallback UI if navigation fails.

3. **Form Validation Issues**
   - **Problem**: In `FullAddressStep.tsx`, the postal code validation uses complex regex patterns for different countries, but there's no clear connection between the selected country and which pattern is used.
   - **Impact**: Users might face validation errors for valid postal codes in countries not explicitly covered.
   - **Code Location**: `src/components/Onboarding/FullAddressStep.tsx`
   - **Recommendation**: Implement country-specific validation that dynamically selects the appropriate pattern based on the user's selected country.

4. **State Management Issues**
   - **Problem**: In `OnBoarding.tsx`, the `activeStep` state is set based on the user's `ob_status`, but there's no handling for when this status is invalid or undefined.
   - **Impact**: Users could see an incorrect step or face UI issues if their status is unexpected.
   - **Code Location**: `src/screens/Onboarding/OnBoarding.tsx`
   - **Recommendation**: Add proper fallback and validation for user status.

5. **Error Handling Issues**
   - **Problem**: In `useOnboardingMutations.ts`, errors are logged to the console but not properly communicated to the user.
   - **Impact**: Users won't understand what went wrong if an API call fails.
   - **Code Location**: `src/components/Onboarding/useOnboardingMutations.ts`
   - **Recommendation**: Implement proper error handling and user-facing error messages.

6. **Navigation Flow Issues**
   - **Problem**: The onboarding flow doesn't have a clear way to go back to previous steps except for the first step.
   - **Impact**: Users can't easily correct mistakes in previous steps.
   - **Code Location**: `src/screens/Onboarding/OnBoarding.tsx`
   - **Recommendation**: Implement a consistent back navigation mechanism for all steps.

### KYC Verification Issues

1. **KYC Provider Integration Issues**
   - **Problem**: The integration with the AiPrise KYC provider lacks proper error handling and status checking.
   - **Impact**: Users might face a broken experience if the KYC provider has issues.
   - **Code Location**: `src/screens/KYCVerification/KYCProvider.tsx`
   - **Recommendation**: Improve error handling and add fallback mechanisms for KYC provider issues.

2. **KYC Success Navigation Issues**
   - **Problem**: After successful KYC verification, the app navigates to KYCSuccess without verifying that the backend has properly updated the user's status.
   - **Impact**: Users might see success screens even if their verification wasn't properly recorded.
   - **Code Location**: `src/screens/KYCVerification/KYCProvider.tsx`
   - **Recommendation**: Add verification that the backend has properly updated the user's status before showing success screens.

### General Issues

1. **Keyboard Handling**
   - **Problem**: In `OnBoarding.tsx`, there's a special UI for when the keyboard is visible, but it might not work correctly on all devices or orientations.
   - **Impact**: Users on certain devices might face UI issues when the keyboard is open.
   - **Code Location**: `src/screens/Onboarding/OnBoarding.tsx`
   - **Recommendation**: Test and improve keyboard handling across different devices and orientations.

2. **Form Field Validation**
   - **Problem**: The validation logic is duplicated across different step components, which could lead to inconsistencies.
   - **Impact**: Different steps might validate the same type of data differently.
   - **Code Location**: Various step components in `src/components/Onboarding/`
   - **Recommendation**: Centralize validation logic to ensure consistency.

3. **API Error Handling**
   - **Problem**: Error handling for API calls is inconsistent across components.
   - **Impact**: Users might not receive appropriate feedback when operations fail.
   - **Code Location**: Various components making API calls
   - **Recommendation**: Implement a consistent error handling strategy across the app.

4. **Navigation Edge Cases**
   - **Problem**: There's no clear handling for what happens if a user tries to navigate directly to a specific onboarding step without completing previous steps.
   - **Impact**: Users could bypass required steps or face broken experiences.
   - **Code Location**: Navigation configuration in `src/screens/MainNavigation.tsx`
   - **Recommendation**: Implement navigation guards to prevent invalid navigation paths.

5. **Data Persistence**
   - **Problem**: The app uses multiple storage mechanisms (Zustand, SecureStore) but it's not clear how they interact or what happens if one fails.
   - **Impact**: Data inconsistencies could occur if one storage mechanism fails.
   - **Code Location**: Various storage implementations
   - **Recommendation**: Clarify the hierarchy and fallback mechanisms for data storage.

6. **Multiple Store Synchronization**
   - **Problem**: The use of separate stores for user data and KYC status could lead to inconsistencies if they're not properly synchronized.
   - **Impact**: Inconsistent state between different stores could lead to navigation issues or incorrect UI rendering.
   - **Code Location**: `src/storage/kycStatusStore.ts` and `src/storage/userStore.ts`
   - **Recommendation**: Implement a synchronization mechanism between the KYC status store and the user store to ensure consistent state.

## Recommendations

### Short-term Fixes

1. **Fix VerifyCTACard Navigation Issues**
   - Modify the VerifyCTACard component to navigate to a transitional screen (like KYCRedirectStep) instead of directly to KYCProvider when the status is "ADDRESS_STEP"
   - Add a status verification step before proceeding to the KYC provider
   - Implement a loading state while verifying the status

2. **Fix KYC Step Synchronization Issue**
   - Add proper waiting mechanism for the address step update to complete before proceeding to KYC
   - Implement status checking in the KYC provider component
   - Add retry logic for the KYC step if the status isn't updated yet

3. **Improve Error Handling**
   - Add more specific error messages for different failure scenarios
   - Implement proper error handling UI components
   - Add retry mechanisms for failed API calls

4. **Enhance Form Validation**
   - Centralize validation logic to avoid duplication
   - Improve validation for international addresses and postal codes
   - Add more user-friendly validation messages

5. **Fix Navigation Issues**
   - Implement proper navigation guards to prevent skipping steps
   - Add a way to resume onboarding from where the user left off
   - Improve the back navigation functionality

### Long-term Improvements

1. **Enhance State Management**
   - Consolidate state management to avoid inconsistencies
   - Implement proper cleanup when users abandon onboarding
   - Add more robust error recovery mechanisms

2. **Improve Testing**
   - Add comprehensive testing for edge cases in the onboarding flow
   - Test with different device sizes and orientations
   - Test with slow network connections and API failures

3. **User Experience Enhancements**
   - Add progress indicators for long-running operations
   - Implement better feedback for form validation
   - Add help text and tooltips for complex fields

### Architectural Improvements

1. **Implement State Machine Pattern**
   - Replace the current step management with a formal state machine
   - Define clear transitions between states with proper validation
   - Prevent invalid state transitions

2. **Create API Middleware Layer**
   - Implement a middleware to handle API synchronization
   - Add request queuing for dependent operations
   - Provide consistent error handling across all API calls

3. **Improve KYC Integration**
   - Create a dedicated KYC service to abstract third-party integration
   - Implement proper status verification before and after KYC process
   - Add fallback mechanisms for KYC provider failures

4. **Enhance Navigation Architecture**
   - Implement navigation guards to prevent invalid navigation paths
   - Add deep linking support for resuming onboarding
   - Create a more flexible back navigation system

5. **Consolidate Store Management**
   - Consider consolidating the user store and KYC status store to avoid inconsistencies
   - Implement a synchronization mechanism between stores if they remain separate
   - Add validation to ensure local state matches backend state

## Next Steps

1. Prioritize the identified issues based on impact and effort
2. Create specific tickets for each issue in the project management system
3. Implement fixes in order of priority
4. Test thoroughly after each fix to ensure no regressions
5. Monitor analytics to measure the impact of improvements on conversion rates 
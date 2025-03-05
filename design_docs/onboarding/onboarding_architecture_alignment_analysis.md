# Onboarding Architecture Alignment Analysis

## Executive Summary

This document analyzes the alignment between the proposed backend and mobile solutions for fixing the onboarding flow issues in the Zeneca mobile app. The analysis focuses on how these approaches complement each other, potential gaps, architectural tradeoffs, and a recommended implementation strategy.

The core issue is a race condition in the KYC verification process, where the app attempts to update the KYC step before the user's status has been properly updated to ADDRESS_STEP on the backend. This affects 4 customers who cannot complete the onboarding process.

Both solutions recognize the need for a state machine pattern but differ in scope and implementation timeline. The mobile solution proposes a focused hybrid approach that can be implemented quickly, while the backend solution offers a comprehensive state machine architecture that requires more time but provides a more robust long-term solution.

## Current Architecture and Issues

### Onboarding Flow Architecture

The onboarding process consists of sequential steps:
1. Full Name (first and last name)
2. Country Selection
3. Full Address (street, city, state, postal code)
4. KYC Verification (redirect to third-party provider)

### Key Components

**Frontend Components:**
- **OnBoarding.tsx**: Main orchestrator component
- **Step Components**: FullNameStep, CountryStep, FullAddressStep, KYCRedirectStep
- **KYC Components**: KYCProvider, KYCSuccess

**State Management:**
- **userStore.ts**: Zustand store for user profile data
- **kycStatusStore.ts**: Store for KYC verification status
- **Form State**: Local state in OnBoarding component

**API Integration:**
- TanStack Query (React Query) for API interactions
- Mutations centralized in `useOnboardingMutations.ts`

### Critical Issues

1. **KYC Step Status Synchronization Issue**
   - The app navigates to the KYC provider screen without waiting for the backend to update the user's status
   - The KYC provider calls the `/kyc-step` endpoint before the user's status is updated to ADDRESS_STEP
   - Backend returns an error: "KYC step can only be completed after address step"
   - Users cannot complete the KYC verification process

2. **Other Identified Issues**
   - Navigation issues in KYCRedirectStep
   - Form validation inconsistencies
   - Insufficient error handling
   - Lack of synchronization between API calls and UI transitions

## Proposed Solutions

### Backend Solution: State Machine Architecture

The backend proposes implementing a comprehensive state machine architecture:

1. **Core Components:**
   - **OnboardingStateMachine**: Manages state transitions with validation rules
   - **OnboardingService**: Centralizes business logic and validation
   - **Custom Exception Types**: Provides consistent error handling
   - **Transaction Management**: Ensures data consistency across entities

2. **Implementation Timeline:**
   - Development Phase: 6 weeks
   - Testing Phase: 2 weeks
   - Staging and Production Deployment: 2 weeks

3. **Key Benefits:**
   - Enforces valid state transitions at the domain level
   - Centralizes business logic in a dedicated service layer
   - Provides consistent error handling with detailed context
   - Makes the system's behavior more predictable and testable

### Mobile Solution: Hybrid State Machine Approach

The mobile solution proposes a focused hybrid approach:

1. **Core Components:**
   - **KYC Transition State Machine**: Mini-state machine specifically for KYC transition
   - **Status Verification API**: Checks if user can proceed to KYC step
   - **Retry Logic**: Implements automatic retries with exponential backoff
   - **Error Handling**: Provides clear error messages and recovery options

2. **Implementation Timeline:**
   - Development Phase: 1 day
   - Testing and Deployment: 1 day
   - Monitoring Period: Ongoing

3. **Key Benefits:**
   - Can be implemented within a 2-day timeline to unblock affected customers
   - Directly addresses the specific race condition
   - Provides clear user feedback during verification
   - Includes automatic and manual retry options

## Architectural Alignment Analysis

### Areas of Alignment

1. **State Machine Pattern**
   - Both approaches recognize the need for a state machine to manage the onboarding flow
   - Both solutions separate business logic from UI/API handling
   - Both emphasize improved error handling and validation

2. **Complementary Solutions**
   - Backend provides the foundation for enforcing valid state transitions
   - Mobile adds verification and retry mechanisms to handle race conditions
   - Together, they create a more robust system with checks on both ends

3. **Shared Goals**
   - Improve user experience during onboarding
   - Reduce errors and abandonment rates
   - Provide better error recovery mechanisms
   - Enable more robust testing and validation

### Potential Gaps and Misalignments

1. **API Contract Changes**
   - Backend introduces a new architecture which might change API contracts
   - Mobile solution assumes the addition of a new status verification endpoint
   - Coordination needed to ensure API compatibility during transition

2. **Error Handling Consistency**
   - Both solutions emphasize improved error handling but might implement different formats
   - Need for standardized error format to ensure consistent user experience

3. **State Representation**
   - Backend uses a formal state machine with transitions and guards
   - Mobile uses a simpler state enum approach
   - Different representations need to be mapped correctly

4. **Validation Logic**
   - Backend centralizes validation in the service layer
   - Mobile implements validation in the state machine and components
   - Risk of inconsistent validation rules if not coordinated

## Architectural Tradeoffs

### 1. Hybrid vs. Full State Machine

**Hybrid Approach (Mobile):**
- **Pros:** Faster implementation, focused on critical issue, less disruptive
- **Cons:** Creates inconsistency in codebase, technical debt, limited scope

**Full State Machine (Backend):**
- **Pros:** Comprehensive solution, consistent architecture, better testability
- **Cons:** Longer implementation time, more complex, requires more coordination

### 2. Polling vs. Event-Driven

**Polling Approach (Mobile):**
- **Pros:** Simpler implementation, works with existing architecture
- **Cons:** Less efficient, potential for delayed updates, more network traffic

**Event-Driven (Future Consideration):**
- **Pros:** More efficient, real-time updates, better scalability
- **Cons:** More complex, requires infrastructure changes, longer implementation

### 3. Frontend vs. Backend Validation

**Frontend Validation (Mobile):**
- **Pros:** Better user experience, immediate feedback, reduced server load
- **Cons:** Can be bypassed, needs to be duplicated on backend

**Backend Validation (Backend):**
- **Pros:** More secure, single source of truth, consistent enforcement
- **Cons:** Requires additional API calls, potential for poorer UX

## Recommended Implementation Strategy

### Phased Implementation Approach

#### Phase 1: Immediate Fix (Days 1-2)
- Implement the mobile hybrid solution to immediately address the KYC verification issue
- Add status verification endpoint on backend (minimal change)
- Implement KYC transition state machine on mobile
- Add retry logic and improved error handling
- Deploy and monitor for the 4 affected customers

#### Phase 2: Backend Architecture (Weeks 1-6)
- Implement the backend state machine architecture
- Refactor backend to use state machine pattern
- Update API endpoints to use new service layer
- Enhance error handling and validation
- Deploy with feature flags to gradually transition

#### Phase 3: Complete Mobile Implementation (Weeks 7-9)
- Extend state machine to entire onboarding flow on mobile
- Replace hybrid approach with full state machine
- Align with backend state transitions
- Implement event-driven updates if appropriate
- Complete the transition to the new architecture

### Coordination Requirements

1. **API Contract Management**
   - Document all API contracts clearly
   - Version APIs to support transition period
   - Ensure backward compatibility where possible

2. **Error Handling Standardization**
   - Define standard error codes and messages
   - Implement consistent error handling on both ends
   - Create error recovery paths for common scenarios

3. **State Transition Alignment**
   - Ensure state definitions match between frontend and backend
   - Document valid transitions and validation rules
   - Create visual representation of the state machine for reference

4. **Testing Strategy**
   - Implement comprehensive testing for both systems
   - Test integration points thoroughly
   - Create automated tests for the complete flow

## Success Metrics

1. **Immediate Metrics**
   - Elimination of KYC verification errors for the 4 affected customers
   - Successful completion of onboarding for new users
   - Reduction in support tickets related to onboarding

2. **Long-term Metrics**
   - Reduction in overall onboarding abandonment rate
   - Improved error recovery rates
   - Decreased average time to complete onboarding
   - Increased robustness to network issues and interruptions

## Conclusion

The proposed backend and mobile solutions are well-aligned in their recognition of the need for a state machine pattern to manage the onboarding flow. They complement each other by addressing different aspects of the problem: the mobile solution provides an immediate fix for the critical race condition, while the backend solution offers a comprehensive architecture for long-term robustness.

By implementing these solutions in phases, we can quickly unblock affected users while building toward a more robust architecture. The key to success will be proper coordination between frontend and backend teams to ensure consistency in API contracts, error handling, and state transitions.

The hybrid approach represents a pragmatic balance between immediate needs and architectural ideals, allowing us to solve the pressing issue quickly while setting the foundation for a more robust solution in the future.

## Next Steps

1. Prioritize the implementation of the status verification endpoint
2. Begin development of the mobile hybrid solution
3. Document API contracts and error handling standards
4. Create a detailed project plan for the backend state machine implementation
5. Establish monitoring for the affected customers
6. Develop a communication plan for coordinating the phased implementation 
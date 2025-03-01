# Onboarding Flow Improvement Plan


## Current Context

- The Zeneca mobile app has an onboarding flow consisting of multiple sequential steps: Full Name, Country Selection, Full Address, and KYC Verification.
- The flow uses a step-based progression where each step must be completed in order, with backend validation enforcing this sequence.
- The KYC verification is integrated with a third-party provider (AiPrise) through the `AiPriseFrame` component.
- Currently, 4 customers are affected by a critical issue where they cannot complete the KYC verification step.
- The main issue is a race condition where the app attempts to update the KYC step before the user's status has been properly updated to ADDRESS_STEP on the backend.
- The backend returns an error: "KYC step can only be completed after address step" when this occurs.
- The app uses Zustand for state management and React Query for API interactions.


## Root Cause Analysis and Solution Strategy

### KYC Step Synchronization Issue: Deep Dive

#### Problem Definition

The critical issue affecting 4 customers is a race condition in the KYC verification step. The specific error returned by the backend is:

```
"KYC step can only be completed after address step"
```

This occurs because:

1. When a user completes the address step, the app calls the address step API endpoint
2. Without waiting for confirmation that the backend has updated the user's status to `ADDRESS_STEP`, the app immediately navigates to the KYC step
3. The KYC provider component attempts to update the KYC step status via API
4. The backend rejects this update because it still sees the user's status as being at an earlier step

This race condition creates a deadlock where users cannot proceed with KYC verification, effectively blocking them from completing the onboarding process.

#### Technical Root Cause

The root cause is a fundamental architectural flaw in how the application manages state transitions:

1. **Asynchronous State Updates**: The backend updates to user status are asynchronous, but the UI transitions treat them as synchronous
2. **Missing Status Verification**: There's no verification that the backend status has been updated before proceeding to the next step
3. **Lack of Retry Mechanism**: When the status isn't updated yet, there's no mechanism to retry or wait for the correct status
4. **Tight Coupling**: The UI flow is tightly coupled to the backend state, but without proper synchronization

#### Solution Approaches Comparison

We've evaluated three potential approaches to solve this issue:

##### 1. Status Verification and Retry Mechanism

**Description**: Implement explicit status checking before proceeding to the KYC step, with a retry mechanism if the status isn't updated yet.

**Pros**:
- Directly addresses the race condition
- Can be implemented quickly (within 2-day timeline)
- Minimal changes to existing architecture
- Provides clear user feedback during verification

**Cons**:
- Still relies on polling rather than event-based updates
- Doesn't address the fundamental architectural issue
- May introduce delays in the user experience

**Implementation Complexity**: Medium
**Timeline**: 1 day

##### 2. Full State Machine Implementation

**Description**: Refactor the onboarding flow to use a formal state machine pattern, with explicit states, transitions, and side effects.

**Pros**:
- Provides a comprehensive solution to state management issues
- Prevents invalid state transitions by design
- Improves testability and maintainability
- Centralizes side effects (API calls) with proper sequencing

**Cons**:
- Requires significant refactoring of existing code
- Longer implementation timeline (exceeds 2-day constraint)
- Higher learning curve for the team
- Potential for regression issues during refactoring

**Implementation Complexity**: High
**Timeline**: 5-7 days

##### 3. Hybrid Approach with Zustand

**Description**: Implement a targeted state machine just for the KYC transition using Zustand, while keeping the rest of the flow as is.

**Pros**:
- Addresses the critical issue without full refactoring
- Leverages existing Zustand architecture
- Can be implemented within timeline constraints
- Provides a pattern that can be expanded later

**Cons**:
- Partial solution to the architectural issues
- Introduces mixed patterns in the codebase
- May require additional refactoring later

**Implementation Complexity**: Medium-Low
**Timeline**: 1-2 days

### Selected Solution: Status Verification with Zustand Mini-State Machine

Based on the constraints (2-day timeline, 4 affected customers) and the analysis of the approaches, we recommend implementing a hybrid solution:

1. **Status Verification**: The app must verify that the user's status is `ADDRESS_STEP` before proceeding to KYC
2. **Retry Logic**: If status is not updated, implement automatic retries (up to 3 times with 2-second intervals)
3. **Error Handling**: Provide clear error messages and recovery options if verification fails
4. **User Feedback**: Show loading states during verification process
5. **Resumability**: Allow users to resume from their last completed step

This approach:
- Directly addresses the immediate issue affecting customers
- Can be implemented within the 2-day timeline
- Provides a foundation for future improvements
- Leverages the existing Zustand architecture

### Implementation Requirements

#### Functional Requirements

1. **Status Verification**: The app must verify that the user's status is `ADDRESS_STEP` before proceeding to KYC
2. **Retry Logic**: If status is not updated, implement automatic retries (up to 3 times with 2-second intervals)
3. **Error Handling**: Provide clear error messages and recovery options if verification fails
4. **User Feedback**: Show loading states during verification process
5. **Resumability**: Allow users to resume from their last completed step

#### Technical Requirements

1. **Backend Status Endpoint**: Add or utilize an endpoint to verify user status
2. **Zustand Store Enhancement**: Extend the existing Zustand store to handle verification state
3. **Component Modifications**:
   - Update `KYCRedirectStep.tsx` to include verification logic
   - Modify `KYCProvider.tsx` to double-check status before API calls
   - Update `OnBoarding.tsx` to wait for API responses before UI transitions
4. **Logging**: Add detailed logging for debugging and monitoring

#### Testing Requirements

1. **Automated Testing**: Create Maestro tests for the verification flow
2. **Manual Testing**: Test with the 4 affected customers
3. **Edge Cases**: Test with slow network conditions and API failures

### Expected Outcomes

1. **Immediate Impact**: The 4 affected customers can complete the KYC verification process
2. **Error Reduction**: Elimination of the "KYC step can only be completed after address step" error
3. **Improved Reliability**: More robust onboarding flow with proper state verification
4. **Foundation for Future**: Pattern established for addressing similar issues in other steps



## Architectural Considerations

### System Architecture Analysis

The onboarding flow operates within a multi-layered architecture:

1. **Presentation Layer**
   - React Native components for UI rendering
   - React Navigation for screen transitions
   - Form components for data collection

2. **State Management Layer**
   - Zustand stores for global state
   - Local component state for UI-specific state
   - Navigation state for flow control

3. **Data Access Layer**
   - React Query for API data fetching and caching
   - API client for communication with backend
   - Local storage for persistence

4. **Backend Services Layer**
   - RESTful API endpoints for onboarding steps
   - Authentication and authorization services
   - Third-party integration services (AiPrise)

The current architecture follows a client-server model with a thick client (mobile app) that manages most of the UI state and business logic, while the server enforces validation rules and maintains the source of truth for user data.

### Architectural Tradeoffs

#### 1. Client-Side vs. Server-Side State Management

**Current Approach**: Hybrid approach with client-side state management (Zustand) and server-side validation.

**Tradeoffs**:
- **Pros**: Better offline experience, faster UI updates, reduced server load
- **Cons**: Potential state synchronization issues, duplicated validation logic

**Alternative**: Server-driven UI where the server dictates the next step and available actions.
- **Pros**: Centralized control, easier to enforce business rules, simplified client logic
- **Cons**: Higher latency, poorer offline experience, increased server load

**Decision**: Maintain the hybrid approach but improve synchronization mechanisms to ensure client and server states remain consistent.

#### 2. Synchronous vs. Asynchronous Flow Control

**Current Approach**: Semi-synchronous flow where UI transitions happen immediately after API calls are initiated.

**Tradeoffs**:
- **Pros**: Faster perceived performance, simpler UI code
- **Cons**: Race conditions, potential inconsistencies between UI and backend state

**Alternative**: Fully asynchronous flow with explicit state transitions only after API confirmation.
- **Pros**: More reliable, fewer race conditions, consistent state
- **Cons**: Perceived performance hit, more complex UI code with loading states

**Decision**: Move toward a more asynchronous flow control model where UI transitions only occur after confirmed backend state changes.

#### 3. Monolithic vs. Modular Component Structure

**Current Approach**: Semi-modular with separate step components but centralized flow control.

**Tradeoffs**:
- **Pros**: Easier to understand the overall flow, centralized control
- **Cons**: Tight coupling, harder to test individual steps, less reusable

**Alternative**: Fully modular components with self-contained logic and state.
- **Pros**: Better separation of concerns, easier testing, more reusable
- **Cons**: More complex coordination, potential duplication

**Decision**: Maintain the current structure for now but introduce better interfaces between components to reduce coupling.

#### 4. Polling vs. Event-Based Updates

**Current Approach**: Polling-based approach where the client periodically checks for status updates.

**Tradeoffs**:
- **Pros**: Simpler implementation, works with RESTful APIs, more reliable in mobile environments
- **Cons**: Increased network traffic, potential delays, less efficient

**Alternative**: Event-based updates using WebSockets or push notifications.
- **Pros**: Real-time updates, reduced network traffic, better user experience
- **Cons**: More complex implementation, potential reliability issues in mobile contexts

**Decision**: Implement polling as an immediate solution but consider event-based updates as a future enhancement.

#### 5. Error Handling Strategies

**Current Approach**: Basic error handling with generic error messages.

**Tradeoffs**:
- **Pros**: Simpler implementation, less code
- **Cons**: Poor user experience, limited recovery options

**Alternative**: Comprehensive error handling with specific recovery paths.
- **Pros**: Better user experience, more robust application
- **Cons**: More complex code, more edge cases to handle

**Decision**: Implement more comprehensive error handling with specific recovery paths for common failure scenarios.

#### 6. Backend vs. Frontend State Machine Implementation

A critical architectural decision is whether to implement the state machine pattern in the frontend, backend, or both. Each approach has distinct tradeoffs:

**Backend State Machine**

*Pros:*
- **Single Source of Truth**: Backend becomes the authoritative source for the current onboarding state, eliminating synchronization issues
- **Stronger Validation**: Business rules and state transitions can be enforced server-side, preventing invalid client-initiated transitions
- **Simplified Frontend Logic**: Frontend becomes primarily responsible for rendering the current state rather than managing complex transition logic
- **Cross-Platform Consistency**: Multiple client platforms (mobile apps, web) share the same state machine implementation
- **Audit Trail**: Easier to log and audit all state transitions in a centralized location
- **Security**: Prevents malicious clients from bypassing steps or manipulating the flow

*Cons:*
- **Higher Latency**: Every state transition requires a server roundtrip, potentially creating a slower user experience
- **Offline Limitations**: Users cannot progress through the flow without connectivity
- **Increased Backend Complexity**: Backend must manage more complex state and session management
- **Scalability Challenges**: High-volume onboarding flows may create significant load on backend services
- **Development Overhead**: Changes to the flow require backend deployment, which typically has a longer cycle than frontend updates

**Frontend State Machine**

*Pros:*
- **Better User Experience**: Immediate feedback and transitions without waiting for server responses
- **Offline Capabilities**: Parts of the flow can potentially work offline with later synchronization
- **Reduced Server Load**: Server only needs to validate and store data, not manage the flow state
- **Faster Development Iterations**: Flow changes can be deployed without backend modifications
- **Rich UI States**: Easier to implement fine-grained UI states like loading, validation, and micro-interactions

*Cons:*
- **Synchronization Challenges**: Frontend state can diverge from backend state, causing the current race conditions
- **Duplicate Validation Logic**: Business rules may need to be implemented in both frontend and backend
- **Inconsistent Implementations**: Different client platforms might implement the state machine differently
- **Security Concerns**: Malicious users could potentially manipulate client-side state
- **Complex Error Recovery**: More difficult to handle error scenarios and ensure consistent state

**Hybrid Approach (Recommended)**

*Pros:*
- **Balanced Responsibility**: Frontend manages UI states and transitions, backend enforces business rules and validates transitions
- **Optimistic Updates**: Frontend can update immediately while waiting for backend confirmation
- **Graceful Degradation**: System can fall back to server-driven flow when needed
- **Incremental Implementation**: Can start with critical transitions and expand over time
- **Flexible Architecture**: Adapts to different requirements for different steps in the flow

*Cons:*
- **Increased Complexity**: Requires careful design to ensure frontend and backend state machines remain synchronized
- **More Communication**: Requires more data exchange between client and server
- **Potential Inconsistencies**: If not carefully implemented, could still result in state divergence

**Decision**: For the immediate fix, we recommend implementing a hybrid approach with a mini-state machine in the frontend for the KYC transition, while ensuring proper synchronization with the backend state. For the long-term vision, we recommend moving toward a more comprehensive hybrid approach where:

1. The backend maintains the authoritative state and enforces all business rules
2. The frontend implements a mirrored state machine for optimal user experience
3. A synchronization protocol ensures consistency between the two
4. Clear error handling and recovery mechanisms address any divergence

This approach balances the immediate need to fix the KYC synchronization issue within the 2-day timeline while setting the foundation for a more robust architecture in the future.

#### Hybrid Approach: Detailed Implementation Strategy

The hybrid approach combines the strengths of both frontend and backend state machines while mitigating their respective weaknesses. Here's a detailed breakdown of how this approach would work:

##### Core Principles

1. **Backend as Source of Truth**
   - The backend maintains the authoritative state of the onboarding process
   - All business rules and validation logic reside on the backend
   - Backend rejects invalid state transitions regardless of frontend requests

2. **Frontend as User Experience Layer**
   - Frontend implements a mirrored state machine for immediate user feedback
   - UI transitions can happen optimistically but are confirmed by backend responses
   - Frontend handles loading, error, and intermediate states invisible to the backend

3. **Bidirectional Synchronization**
   - Frontend periodically verifies its state against the backend
   - Backend provides clear status information in all responses
   - Discrepancies trigger reconciliation processes

##### Implementation Patterns

1. **State Definition and Mapping**

   The onboarding states should be explicitly defined in both frontend and backend, with clear mapping between them:

   ```typescript
   // Frontend state definition (Zustand)
   type OnboardingState = 
     | { status: 'idle' }
     | { status: 'collectingNames', data?: NameFormData }
     | { status: 'submittingNames', data: NameFormData }
     | { status: 'collectingCountry', data?: CountryFormData }
     | { status: 'submittingCountry', data: CountryFormData }
     | { status: 'collectingAddress', data?: AddressFormData }
     | { status: 'submittingAddress', data: AddressFormData }
     | { status: 'verifyingAddressStatus' }
     | { status: 'redirectingToKYC' }
     | { status: 'completingKYC' }
     | { status: 'submittingKYC', data: KYCData }
     | { status: 'completed' }
     | { status: 'error', error: Error, previousStatus: string };
   
   // Backend state definition (enum)
   enum OnboardingStatus {
     NOT_STARTED = 'NOT_STARTED',
     NAMES_STEP = 'NAMES_STEP',
     COUNTRY_STEP = 'COUNTRY_STEP',
     ADDRESS_STEP = 'ADDRESS_STEP',
     KYC_PROVIDER_STEP = 'KYC_PROVIDER_STEP',
     COMPLETED = 'COMPLETED'
   }
   
   // Mapping between frontend and backend states
   const mapBackendToFrontendState = (backendStatus: OnboardingStatus): string => {
     switch (backendStatus) {
       case OnboardingStatus.NOT_STARTED: return 'idle';
       case OnboardingStatus.NAMES_STEP: return 'collectingCountry';
       case OnboardingStatus.COUNTRY_STEP: return 'collectingAddress';
       case OnboardingStatus.ADDRESS_STEP: return 'redirectingToKYC';
       case OnboardingStatus.KYC_PROVIDER_STEP: return 'completingKYC';
       case OnboardingStatus.COMPLETED: return 'completed';
       default: return 'idle';
     }
   };
   ```

2. **Transition Guards**

   Both frontend and backend implement guards that validate state transitions:

   ```typescript
   // Frontend transition guard
   const canTransitionTo = (currentState: string, targetState: string): boolean => {
     const validTransitions: Record<string, string[]> = {
       'idle': ['collectingNames'],
       'collectingNames': ['submittingNames'],
       'submittingNames': ['collectingCountry', 'error'],
       'collectingCountry': ['submittingCountry'],
       'submittingCountry': ['collectingAddress', 'error'],
       'collectingAddress': ['submittingAddress'],
       'submittingAddress': ['verifyingAddressStatus', 'error'],
       'verifyingAddressStatus': ['redirectingToKYC', 'verifyingAddressStatus', 'error'],
       'redirectingToKYC': ['completingKYC', 'error'],
       'completingKYC': ['submittingKYC', 'error'],
       'submittingKYC': ['completed', 'error'],
       'error': ['idle', 'collectingNames', 'collectingCountry', 'collectingAddress', 'verifyingAddressStatus'],
     };
     
     return validTransitions[currentState]?.includes(targetState) || false;
   };
   
   // Backend transition guard (pseudocode)
   function validateStateTransition(userId, currentStatus, targetStatus) {
     const validTransitions = {
       'NOT_STARTED': ['NAMES_STEP'],
       'NAMES_STEP': ['COUNTRY_STEP'],
       'COUNTRY_STEP': ['ADDRESS_STEP'],
       'ADDRESS_STEP': ['KYC_PROVIDER_STEP'],
       'KYC_PROVIDER_STEP': ['COMPLETED']
     };
     
     if (!validTransitions[currentStatus]?.includes(targetStatus)) {
       throw new InvalidStateTransitionError(
         `Cannot transition from ${currentStatus} to ${targetStatus}`
       );
     }
     
     // Additional business rule validation
     if (targetStatus === 'KYC_PROVIDER_STEP' && currentStatus !== 'ADDRESS_STEP') {
       throw new InvalidStateTransitionError(
         `KYC step can only be completed after address step. Current status: ${currentStatus}`
       );
     }
   }
   ```

3. **Synchronization Mechanisms**

   Several mechanisms ensure frontend and backend states remain synchronized:

   a. **Status Verification**
   ```typescript
   // Frontend status verification
   const verifyStatus = async () => {
     try {
       // Fetch current status from backend
       const { status } = await api.verifyStatus();
       
       // Get current frontend state
       const currentState = useOnboardingStore.getState().status;
       
       // Map backend status to expected frontend state
       const expectedState = mapBackendToFrontendState(status);
       
       // If states don't match, reconcile
       if (currentState !== expectedState && currentState !== 'error') {
         console.log(`State mismatch: frontend=${currentState}, backend=${status} (expected=${expectedState})`);
         
         // Reconcile by updating frontend state
         useOnboardingStore.getState().reconcile(expectedState);
       }
     } catch (error) {
       console.error("Error verifying status:", error);
     }
   };
   ```

   b. **Optimistic Updates with Rollback**
   ```typescript
   // Optimistic update with rollback
   const submitAddress = async (addressData) => {
     // Store previous state for rollback
     const previousState = useOnboardingStore.getState().status;
     
     // Optimistically update state
     useOnboardingStore.getState().transition('submittingAddress', addressData);
     
     try {
       // Call API
       await api.submitAddress(addressData);
       
       // On success, move to next state
       useOnboardingStore.getState().transition('verifyingAddressStatus');
       
       // Start verification process
       startStatusVerification();
     } catch (error) {
       // On failure, rollback to previous state with error
       useOnboardingStore.getState().transition('error', { 
         error, 
         previousStatus: previousState 
       });
     }
   };
   ```

   c. **Periodic Status Polling**
   ```typescript
   // Status polling with exponential backoff
   const startStatusVerification = () => {
     let attempts = 0;
     const maxAttempts = 3;
     const baseDelay = 2000; // 2 seconds
     
     const checkStatus = async () => {
       try {
         const { status, canProceedToKyc } = await api.verifyStatus();
         
         if (canProceedToKyc) {
           // Status is verified, proceed to KYC
           useOnboardingStore.getState().transition('redirectingToKYC');
           return;
         }
         
         // Status not ready yet
         if (attempts < maxAttempts) {
           attempts++;
           const delay = baseDelay * Math.pow(1.5, attempts - 1); // Exponential backoff
           setTimeout(checkStatus, delay);
         } else {
           // Max attempts reached
           useOnboardingStore.getState().transition('error', {
             error: new Error("Unable to verify status after multiple attempts"),
             previousStatus: 'verifyingAddressStatus'
           });
         }
       } catch (error) {
         useOnboardingStore.getState().transition('error', {
           error,
           previousStatus: 'verifyingAddressStatus'
         });
       }
     };
     
     checkStatus();
   };
   ```

##### Concrete Example: KYC Transition

For the specific KYC transition issue, here's how the hybrid approach would work:

1. **Frontend State Machine for KYC Transition**

   ```typescript
   // KYC transition mini-state machine using Zustand
   interface KYCTransitionState {
     status: 'idle' | 'verifying' | 'ready' | 'redirecting' | 'completing' | 'submitting' | 'error';
     error: Error | null;
     retryCount: number;
     canProceedToKYC: boolean;
     
     // Actions
     startVerification: () => void;
     handleVerificationSuccess: () => void;
     handleVerificationFailure: (error: Error) => void;
     redirectToKYC: () => void;
     completeKYC: (data: any) => void;
     submitKYCData: (data: any) => Promise<void>;
     retry: () => void;
   }
   
   const useKYCTransitionStore = create<KYCTransitionState>((set, get) => ({
     status: 'idle',
     error: null,
     retryCount: 0,
     canProceedToKYC: false,
     
     startVerification: async () => {
       set({ status: 'verifying', error: null });
       
       try {
         // Fetch user status from backend
         const response = await api.verifyStatus();
         
         if (response.canProceedToKyc) {
           set({ status: 'ready', canProceedToKYC: true });
           get().handleVerificationSuccess();
         } else {
           // Status not ready, implement retry logic
           const retryCount = get().retryCount + 1;
           
           if (retryCount < 3) {
             set({ retryCount });
             // Retry after delay with exponential backoff
             setTimeout(() => get().startVerification(), 2000 * Math.pow(1.5, retryCount - 1));
           } else {
             throw new Error("Maximum retry attempts reached. Please try again later.");
           }
         }
       } catch (error) {
         get().handleVerificationFailure(error);
       }
     },
     
     handleVerificationSuccess: () => {
       set({ status: 'ready', canProceedToKYC: true });
     },
     
     handleVerificationFailure: (error) => {
       set({ status: 'error', error });
     },
     
     redirectToKYC: () => {
       if (get().status !== 'ready') {
         console.error("Cannot redirect to KYC: status not ready");
         return;
       }
       
       set({ status: 'redirecting' });
       // Navigation logic would be implemented here
     },
     
     completeKYC: (data) => {
       set({ status: 'completing' });
       // Process KYC completion data
       get().submitKYCData(data);
     },
     
     submitKYCData: async (data) => {
       set({ status: 'submitting' });
       
       try {
         await api.submitKYCData(data);
         set({ status: 'idle', retryCount: 0, canProceedToKYC: false });
         // Additional success handling
       } catch (error) {
         set({ status: 'error', error });
       }
     },
     
     retry: () => {
       set({ retryCount: 0, error: null, status: 'idle' });
       get().startVerification();
     }
   }));
   ```

2. **Component Integration**

   ```tsx
   // KYCRedirectStep.tsx
   const KYCRedirectStep = ({ formValues, onValidationChange }: OnBoardingStepProps) => {
     const navigation = useNavigation();
     const kycTransition = useKYCTransitionStore();
     
     // Set validation to true so the next button is enabled
     useEffect(() => {
       onValidationChange(true);
     }, []);
     
     // Start verification when component mounts
     useEffect(() => {
       kycTransition.startVerification();
     }, []);
     
     // Handle state changes
     useEffect(() => {
       if (kycTransition.status === 'ready') {
         kycTransition.redirectToKYC();
       }
       
       if (kycTransition.status === 'redirecting') {
         navigation.navigate("KYCProvider", {
           country_code: formValues.country_code,
           full_address: {
             address_street_1: formValues.address_street_1,
             address_street_2: formValues.address_street_2,
             address_city: formValues.address_city,
             address_state: formValues.address_state,
             address_zip_code: formValues.address_postal_code || "00000",
             address_country: formValues.country_code,
           },
         });
       }
     }, [kycTransition.status]);
     
     if (kycTransition.status === 'verifying') {
       return <FullScreenLoader text="Preparing verification..." />;
     }
     
     if (kycTransition.status === 'error') {
       return (
         <View className="flex-1 justify-center items-center p-layout">
           <Text className="heading-s text-gray-10 mb-4 text-center">
             Verification Error
           </Text>
           <Text className="body-s text-gray-40 mb-8 text-center">
             {kycTransition.error?.message || "An error occurred during verification."}
           </Text>
           <Button onPress={kycTransition.retry}>
             <Text className="body-m">Try Again</Text>
           </Button>
         </View>
       );
     }
     
     // This should rarely be seen as we either show loader or error, or navigate away
     return <View />;
   };
   ```

3. **Backend Status Verification Endpoint**

   ```python
   # Backend API endpoint for status verification
   @router.get("/verify-status", response_model=StatusVerificationResponse)
   async def verify_onboarding_status(user: CurrentUser, session: SessionDep):
       crud = AccountCRUD(session)
       account = await crud.get_by_user_id(user.id)
   
       if not account:
           raise HTTPException(status_code=404, detail="Account not found")
   
       return {
           "status": account.ob_status,
           "can_proceed_to_kyc": account.ob_status == OnboardingStatus.ADDRESS_STEP,
           "last_updated": account.updated_at.isoformat(),
           "next_allowed_steps": get_allowed_next_steps(account.ob_status)
       }
   
   def get_allowed_next_steps(current_status: str) -> List[str]:
       """Return the list of valid next steps based on current status."""
       transitions = {
           OnboardingStatus.NOT_STARTED: [OnboardingStatus.NAMES_STEP],
           OnboardingStatus.NAMES_STEP: [OnboardingStatus.COUNTRY_STEP],
           OnboardingStatus.COUNTRY_STEP: [OnboardingStatus.ADDRESS_STEP],
           OnboardingStatus.ADDRESS_STEP: [OnboardingStatus.KYC_PROVIDER_STEP],
           OnboardingStatus.KYC_PROVIDER_STEP: [OnboardingStatus.COMPLETED]
       }
       
       return transitions.get(current_status, [])
   ```

##### Benefits of This Hybrid Implementation

1. **Immediate User Feedback**
   - Users see loading states and error messages without waiting for server responses
   - UI transitions feel responsive while maintaining data integrity

2. **Robust Error Handling**
   - Clear error states with specific messages
   - Retry mechanisms with exponential backoff
   - Graceful degradation when backend is unavailable

3. **Maintainable Code Structure**
   - Clear separation between UI state and backend state
   - Explicit state transitions with validation
   - Self-documenting code with type safety

4. **Scalable Architecture**
   - Pattern can be extended to other parts of the onboarding flow
   - Consistent approach to state management
   - Foundation for future improvements

##### Limitations and Mitigations

1. **Increased Complexity**
   - **Mitigation**: Start with the KYC transition as a focused implementation, then expand
   - **Mitigation**: Provide clear documentation and examples for the team

2. **Potential State Divergence**
   - **Mitigation**: Regular status verification
   - **Mitigation**: Clear error recovery paths
   - **Mitigation**: Logging of state transitions for debugging

3. **Learning Curve**
   - **Mitigation**: Pair programming sessions
   - **Mitigation**: Gradual adoption starting with critical flows

This hybrid approach provides the best of both worlds: the reliability of backend state management with the responsiveness of frontend state machines. By implementing this pattern for the KYC transition first, we can address the immediate issue while establishing a pattern that can be expanded to the entire onboarding flow over time.

### Architectural Patterns

The solution introduces or enhances several architectural patterns:

1. **Retry Pattern**
   - Automatically retry operations that might fail due to transient conditions
   - Implement exponential backoff to avoid overwhelming the server
   - Set maximum retry limits to prevent infinite loops

2. **Circuit Breaker Pattern**
   - Detect when operations are likely to fail and prevent repeated attempts
   - Provide fallback mechanisms when operations consistently fail
   - Automatically reset after a cooling-off period

3. **Saga Pattern (Lightweight Implementation)**
   - Treat the onboarding flow as a series of compensating transactions
   - Ensure each step can be rolled back or retried independently
   - Maintain a record of completed steps for resumability

4. **Observer Pattern**
   - Components observe the global state for changes
   - UI updates reactively based on state changes
   - Decouples state management from UI rendering

5. **Command Pattern**
   - Encapsulate API requests as commands
   - Queue commands when offline or when prerequisites aren't met
   - Execute commands when conditions are favorable

### Technical Debt Considerations

The proposed solution introduces some technical debt that should be addressed in future iterations:

1. **Mixed State Management Approaches**
   - The hybrid approach with a mini-state machine for KYC transitions alongside the existing pattern creates inconsistency
   - Future work should standardize on a single approach across the entire onboarding flow

2. **Polling Mechanism**
   - The polling approach is less efficient than event-based updates
   - Future work should consider implementing WebSockets or push notifications

3. **Error Recovery**
   - The current error recovery mechanisms are still relatively basic
   - Future work should implement more sophisticated recovery strategies

4. **Test Coverage**
   - The tight timeline may limit comprehensive test coverage
   - Future work should increase test coverage, especially for edge cases

### Scalability Considerations

The solution has been designed with the following scalability considerations:

1. **User Scalability**
   - The solution should handle increased user load without degradation
   - Polling intervals are staggered to prevent thundering herd problems

2. **Feature Scalability**
   - The architecture allows for adding new onboarding steps with minimal changes
   - The verification pattern can be extended to other critical transitions

3. **Organizational Scalability**
   - The code structure and documentation support multiple developers working on the codebase
   - Clear interfaces between components allow for parallel development

### Migration Path

The implementation plan provides a clear migration path from the current architecture to the improved architecture:

1. **Phase 1**: Address immediate issues with minimal architectural changes
2. **Phase 2**: Introduce new patterns and endpoints to support better synchronization
3. **Phase 3**: Test thoroughly to ensure reliability
4. **Future Phases**: Consider more fundamental architectural improvements like a full state machine implementation

This phased approach balances the need for immediate fixes with the desire for architectural improvement, while minimizing risk and disruption.



## Future Architecture Vision

### Long-Term Architectural Goals

Looking beyond the immediate fixes, we envision a more robust and scalable architecture for the onboarding flow:

1. **Full State Machine Implementation**
   - Implement a comprehensive state machine using Zustand or a dedicated state machine library like XState
   - Define explicit states, transitions, guards, and actions
   - Visualize the flow for better understanding and documentation
   - Enable advanced features like time-travel debugging and state persistence

2. **Event-Driven Architecture**
   - Replace polling with real-time event notifications
   - Implement WebSockets or push notifications for immediate state updates
   - Reduce network overhead and improve user experience
   - Enable more responsive UI updates based on backend events

3. **Microservices Backend**
   - Decompose the monolithic backend into specialized microservices
   - Create a dedicated onboarding service with its own database
   - Implement event sourcing for reliable state tracking
   - Enable independent scaling of onboarding components

### Reference Architecture

The target architecture would consist of:

1. **Frontend Layer**
   - React Native application with modular components
   - State machine for flow control
   - Offline-first data management
   - Responsive UI with clear loading and error states

2. **API Gateway Layer**
   - Unified API for client communication
   - Authentication and authorization
   - Rate limiting and request validation
   - Analytics and monitoring

3. **Service Layer**
   - Onboarding service for step management
   - User service for profile management
   - KYC service for identity verification
   - Notification service for user communications

4. **Data Layer**
   - Event store for state transitions
   - Document store for user profiles
   - Cache for frequently accessed data
   - Analytics store for metrics and reporting

### Migration Strategy

To reach this target architecture, we recommend a phased approach:

1. **Phase 1: Foundation** (Current Plan)
   - Fix immediate issues with minimal architectural changes
   - Improve error handling and synchronization
   - Establish patterns for future improvements

2. **Phase 2: State Management Refactoring** (1-2 months)
   - Implement a proper state machine for the onboarding flow
   - Refactor components to work with the state machine
   - Improve test coverage and documentation

3. **Phase 3: Backend Enhancements** (2-3 months)
   - Implement event-driven updates
   - Enhance API endpoints for better client-server communication
   - Improve logging and monitoring

4. **Phase 4: Advanced Features** (3-6 months)
   - Implement offline support and background synchronization
   - Add cross-device resumability
   - Enhance analytics and reporting

### Technical Enablers

To support this vision, several technical enablers should be put in place:

1. **Infrastructure**
   - CI/CD pipeline for reliable deployments
   - Automated testing framework
   - Performance monitoring tools
   - Feature flagging system

2. **Development Practices**
   - Component-driven development
   - Test-driven development
   - Documentation as code
   - Pair programming for knowledge sharing

3. **Tools and Libraries**
   - State machine library (XState or similar)
   - Real-time communication library
   - Offline data synchronization
   - Advanced logging and monitoring

### Expected Benefits

This architectural vision would deliver several key benefits:

1. **Improved Reliability**
   - Fewer race conditions and synchronization issues
   - Better error handling and recovery
   - More predictable behavior

2. **Enhanced User Experience**
   - Faster perceived performance
   - Better feedback during operations
   - Ability to resume interrupted flows

3. **Developer Productivity**
   - Clearer code organization
   - Better testability
   - Easier onboarding for new team members

4. **Business Agility**
   - Faster implementation of new features
   - Easier A/B testing of flow variations
   - Better analytics for optimization


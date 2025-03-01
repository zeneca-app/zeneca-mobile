# Hybrid State Machine Approach for Onboarding Flow Design Document

## Current Context

- The Zeneca mobile app has an onboarding flow consisting of multiple sequential steps: Full Name, Country Selection, Full Address, and KYC Verification.
- The flow uses a step-based progression where each step must be completed in order, with backend validation enforcing this sequence.
- Currently, 4 customers are affected by a critical issue where they cannot complete the KYC verification step due to a race condition.
- The race condition occurs when the app attempts to update the KYC step before the user's status has been properly updated to ADDRESS_STEP on the backend.
- The backend returns an error: "KYC step can only be completed after address step" when this occurs.
- The app uses Zustand for state management and React Query for API interactions.
- We need a solution that can be implemented within a 2-day timeline to unblock the affected customers.

## Requirements

### Functional Requirements

1. **Status Verification**
   - The app must verify that the user's status is `ADDRESS_STEP` before proceeding to KYC
   - Verification must happen automatically without user intervention
   - System must provide clear feedback during verification

2. **Retry Logic**
   - If status is not updated, implement automatic retries (up to 3 times with exponential backoff)
   - Each retry should wait longer than the previous one (2s, 3s, 4.5s)
   - After maximum retries, present a user-friendly error with manual retry option

3. **Error Handling**
   - Provide clear error messages for different failure scenarios
   - Offer appropriate recovery options based on error type
   - Log detailed error information for debugging

4. **User Feedback**
   - Show loading states during verification process
   - Provide progress indicators during longer operations
   - Communicate success/failure clearly to users

5. **Resumability**
   - Allow users to resume from their last completed step
   - Preserve form data between sessions
   - Handle app restarts gracefully

### Non-Functional Requirements

1. **Performance**
   - Verification process should complete within 10 seconds total
   - UI must remain responsive during verification
   - Minimize network requests to reduce data usage

2. **Scalability**
   - Solution must work for all users, not just the 4 affected customers
   - Architecture should support future onboarding steps without major refactoring
   - Backend must handle increased verification requests

3. **Observability**
   - Add detailed logging for all state transitions
   - Track verification success/failure rates
   - Monitor retry attempts and resolution paths

4. **Security**
   - Maintain existing authentication mechanisms
   - Ensure sensitive user data remains protected
   - Prevent manipulation of onboarding state

## Design Decisions

### 1. Hybrid State Machine Architecture

Will implement a hybrid approach with a mini-state machine in the frontend for the KYC transition because:

- Balances immediate fix needs with architectural improvement
- Can be implemented within the 2-day timeline constraint
- Addresses the specific race condition without requiring full refactoring
- Leverages existing Zustand architecture
- Provides a pattern that can be expanded to the entire flow later

Trade-offs considered:
- Full state machine would be more comprehensive but exceeds timeline
- Simple status check without state machine would be faster to implement but less robust
- Backend-only solution would require more coordination and deployment time

### 2. Synchronization Mechanism

Will implement status verification with polling and exponential backoff because:

- Directly addresses the race condition issue
- Works with existing RESTful API architecture
- More reliable in mobile environments with potentially unstable connections
- Simpler to implement than event-based alternatives

Alternatives considered:
- WebSockets would provide real-time updates but require significant backend changes
- Push notifications would be more efficient but add complexity and platform-specific code
- Event sourcing would be more robust but require major architectural changes

### 3. Error Recovery Strategy

Will implement comprehensive error handling with specific recovery paths because:

- Improves user experience during failure scenarios
- Reduces support tickets by enabling self-recovery
- Provides better diagnostics for debugging
- Addresses the specific needs of the affected customers

Alternatives considered:
- Generic error handling would be simpler but provide poorer user experience
- Automatic-only recovery without manual options would be less flexible
- Complex recovery workflows would exceed the timeline constraints

## Technical Design

### 1. Core Components

#### Frontend Components

```typescript
// KYC Transition State Machine
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

// Zustand Store Implementation
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
    // Additional success handling
  },
  
  handleVerificationFailure: (error) => {
    set({ status: 'error', error });
    // Log error for analytics
    logError('KYC verification failure', error);
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

#### Backend Components

```python
# Status Verification Endpoint
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

# Helper function to determine valid next steps
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

### 2. Data Models

```typescript
// Frontend State Types
type OnboardingStatus = 
  | 'NOT_STARTED'
  | 'NAMES_STEP'
  | 'COUNTRY_STEP' 
  | 'ADDRESS_STEP'
  | 'KYC_PROVIDER_STEP'
  | 'COMPLETED';

// Status Verification Response
interface StatusVerificationResponse {
  status: OnboardingStatus;
  can_proceed_to_kyc: boolean;
  last_updated: string;
  next_allowed_steps: OnboardingStatus[];
}

// KYC Data Model
interface KYCData {
  verification_id: string;
  verification_status: string;
  verification_timestamp: string;
  provider: string;
  metadata?: Record<string, any>;
}
```

```python
# Backend Data Models
class OnboardingStatus(str, Enum):
    NOT_STARTED = "NOT_STARTED"
    NAMES_STEP = "NAMES_STEP"
    COUNTRY_STEP = "COUNTRY_STEP"
    ADDRESS_STEP = "ADDRESS_STEP"
    KYC_PROVIDER_STEP = "KYC_PROVIDER_STEP"
    COMPLETED = "COMPLETED"

class StatusVerificationResponse(BaseModel):
    status: OnboardingStatus
    can_proceed_to_kyc: bool
    last_updated: str
    next_allowed_steps: List[OnboardingStatus]
```

### 3. Integration Points

#### Frontend to Backend Integration

1. **Status Verification API**
   - Endpoint: `GET /api/v1/onboarding/verify-status`
   - Purpose: Check if user can proceed to KYC step
   - Response: Status information with allowed next steps

2. **Address Step API**
   - Endpoint: `POST /api/v1/onboarding/address-step`
   - Purpose: Submit address information
   - Triggers: Backend status update to ADDRESS_STEP

3. **KYC Step API**
   - Endpoint: `POST /api/v1/onboarding/kyc-step`
   - Purpose: Submit KYC verification results
   - Requires: User status must be ADDRESS_STEP

#### Frontend Component Integration

1. **KYCRedirectStep Component**
   - Integrates with KYCTransitionStore
   - Handles verification before navigation
   - Displays loading and error states

2. **KYCProvider Component**
   - Receives navigation from KYCRedirectStep
   - Integrates with AiPrise third-party service
   - Handles KYC completion callback

3. **OnBoarding Component**
   - Manages overall flow between steps
   - Passes form data between steps
   - Handles navigation based on completion status

#### Data Flow Diagram

```
┌─────────────┐      ┌─────────────────┐      ┌────────────────┐
│ Address Step│──1──▶│Status Verification│──2──▶│ KYC Redirect  │
└─────────────┘      └─────────────────┘      └────────────────┘
                                                      │
                                                      ▼
┌─────────────┐      ┌─────────────────┐      ┌────────────────┐
│  KYC Step   │◀─5───│  KYC Provider   │◀─3───│ AiPrise Frame  │
└─────────────┘      └─────────────────┘      └────────────────┘
                             │                        │
                             │                        │
                             ▼                        ▼
                     ┌─────────────────┐      ┌────────────────┐
                     │ Onboarding Flow │◀─4───│ KYC Completion │
                     └─────────────────┘      └────────────────┘
```

1. User completes Address Step, triggering status update
2. Status Verification confirms ADDRESS_STEP status
3. User is redirected to KYC Provider with AiPrise integration
4. KYC completion callback is received
5. KYC Step is updated in the backend

## Implementation Plan

### 1. Phase 1: Core Implementation (Day 1 - Morning)

**Task 1: Backend Status Verification Endpoint (Size: S)**
- Create new endpoint for status verification
- Implement status checking logic
- Add allowed transitions mapping
- Write unit tests
- Expected timeline: 2 hours

**Task 2: Frontend KYC Transition Store (Size: M)**
- Create Zustand store for KYC transition
- Implement state machine logic
- Add verification and retry mechanisms
- Write unit tests
- Expected timeline: 3 hours

**Task 3: KYCRedirectStep Component Updates (Size: S)**
- Integrate with KYC transition store
- Add loading and error states
- Implement navigation logic
- Expected timeline: 2 hours

### 2. Phase 2: Integration and Error Handling (Day 1 - Afternoon)

**Task 4: KYCProvider Component Updates (Size: M)**
- Add status double-checking before API calls
- Implement error handling for invalid states
- Update navigation logic
- Expected timeline: 3 hours

**Task 5: OnBoarding Component Updates (Size: S)**
- Update to wait for API responses before transitions
- Improve error handling
- Add resumability support
- Expected timeline: 2 hours

**Task 6: Logging and Analytics (Size: XS)**
- Add detailed logging for state transitions
- Implement error tracking
- Create analytics events
- Expected timeline: 1 hour

### 3. Phase 3: Testing and Deployment (Day 2)

**Task 7: Automated Testing (Size: M)**
- Create Maestro tests for verification flow
- Test error scenarios and recovery paths
- Test with slow network conditions
- Expected timeline: 3 hours

**Task 8: Manual Testing (Size: S)**
- Test with the 4 affected customers
- Verify all error scenarios
- Test on different devices and OS versions
- Expected timeline: 2 hours

**Task 9: Deployment Preparation (Size: XS)**
- Prepare release notes
- Update documentation
- Create rollback plan
- Expected timeline: 1 hour

**Task 10: Deployment and Monitoring (Size: S)**
- Deploy to production
- Monitor error rates
- Track affected customers' progress
- Provide support as needed
- Expected timeline: 2 hours + ongoing monitoring

### 4. Phase 4: Follow-up and Refinement (Post-Implementation)

**Task 11: Performance Analysis (Size: XS)**
- Analyze verification times
- Identify bottlenecks
- Recommend optimizations
- Expected timeline: 2 hours

**Task 12: Documentation Update (Size: S)**
- Update technical documentation
- Document patterns for future use
- Create developer guidelines
- Expected timeline: 3 hours

**Task 13: Architecture Planning (Size: M)**
- Plan for full state machine implementation
- Create migration strategy
- Identify next steps
- Expected timeline: 4 hours

## Testing Strategy

### Unit Tests

1. **KYC Transition Store Tests**
   - Test all state transitions
   - Verify retry logic with mocked timers
   - Test error handling scenarios
   - Verify store initialization and reset

2. **Status Verification Endpoint Tests**
   - Test with different user statuses
   - Verify correct determination of can_proceed_to_kyc
   - Test error cases (user not found, etc.)
   - Verify next_allowed_steps logic

3. **Component Tests**
   - Test KYCRedirectStep rendering in different states
   - Verify loading and error states
   - Test navigation logic
   - Verify form data handling

### Integration Tests

1. **End-to-End Flow Tests**
   - Test complete flow from Address to KYC
   - Verify status verification works correctly
   - Test with different network conditions
   - Verify error recovery paths

2. **Error Scenario Tests**
   - Test with backend returning errors
   - Verify retry mechanism works
   - Test maximum retries scenario
   - Verify manual retry functionality

3. **Edge Case Tests**
   - Test with very slow responses
   - Test with intermittent connectivity
   - Test with app backgrounding/foregrounding
   - Test with app restart during process

## Observability

### Logging

1. **State Transition Logging**
   - Log all state transitions with before/after states
   - Include timestamp and duration
   - Log user ID (hashed) for correlation
   - Use structured logging format

2. **Error Logging**
   - Log detailed error information
   - Include error type, message, and stack trace
   - Log retry attempts and outcomes
   - Include context information for debugging

3. **Performance Logging**
   - Log API call durations
   - Track verification process time
   - Log retry delays and counts
   - Monitor overall flow completion time

### Metrics

1. **Success/Failure Metrics**
   - Track verification success rate
   - Monitor KYC completion rate
   - Track error rates by type
   - Measure retry frequency

2. **Performance Metrics**
   - Measure average verification time
   - Track API response times
   - Monitor UI responsiveness
   - Measure end-to-end flow completion time

3. **User Experience Metrics**
   - Track time spent on each screen
   - Monitor manual retry frequency
   - Measure abandonment rate
   - Track support ticket creation related to onboarding

## Future Considerations

### Potential Enhancements

1. **Full State Machine Implementation**
   - Extend the pattern to all onboarding steps
   - Implement visualization tools for the state machine
   - Add time-travel debugging capabilities
   - Improve state persistence

2. **Real-Time Updates**
   - Replace polling with WebSockets or push notifications
   - Implement event-driven architecture
   - Add real-time progress indicators
   - Enable cross-device synchronization

3. **Offline Support**
   - Implement offline data collection
   - Add background synchronization
   - Improve resumability across sessions
   - Enhance error recovery for offline scenarios

### Known Limitations

1. **Polling Inefficiency**
   - Current polling approach is less efficient than event-based updates
   - May cause unnecessary network traffic
   - Potential for delayed updates in poor network conditions

2. **Mixed Architecture**
   - The hybrid approach creates some inconsistency in the codebase
   - Different patterns for different parts of the flow
   - May require additional documentation for developers

3. **Limited Scope**
   - Current implementation focuses only on KYC transition
   - Other transitions may still have similar issues
   - Full solution would require broader implementation

## Dependencies

### Runtime Dependencies

1. **Frontend**
   - React Native (current version)
   - Zustand for state management
   - React Query for API interactions
   - React Navigation for screen transitions

2. **Backend**
   - FastAPI framework
   - SQLAlchemy for database access
   - Pydantic for data validation
   - AiPrise SDK for KYC integration

### Development Dependencies

1. **Testing Tools**
   - Jest for unit testing
   - Maestro for E2E testing
   - Mock Service Worker for API mocking
   - Testing Library for component testing

2. **Development Utilities**
   - TypeScript for type checking
   - ESLint for code quality
   - Prettier for code formatting
   - Husky for pre-commit hooks

## Security Considerations

1. **Authentication/Authorization**
   - Maintain existing JWT authentication
   - Ensure proper authorization for status verification
   - Prevent unauthorized access to user data
   - Validate all API requests

2. **Data Protection**
   - Ensure sensitive data is not logged
   - Use secure storage for user information
   - Implement proper error handling without exposing details
   - Follow existing data protection policies

3. **State Manipulation Prevention**
   - Validate all state transitions on the backend
   - Prevent skipping of required steps
   - Implement proper validation of KYC data
   - Log suspicious activity for review

## Rollout Strategy

1. **Development Phase (Day 1 - Morning)**
   - Implement core components
   - Set up testing environment
   - Create initial documentation

2. **Testing Phase (Day 1 - Afternoon)**
   - Run automated tests
   - Perform manual testing
   - Address any issues found

3. **Staging Deployment (Day 2 - Morning)**
   - Deploy to staging environment
   - Test with production-like data
   - Verify monitoring and logging

4. **Production Deployment (Day 2 - Afternoon)**
   - Deploy to production
   - Monitor closely for issues
   - Focus on the 4 affected customers

5. **Monitoring Period (Day 2 - Evening and Day 3)**
   - Continue monitoring error rates
   - Track affected customers' progress
   - Be ready for quick fixes if needed
   - Gather data for future improvements

## References

- [Onboarding Flow Improvement Plan](./onboarding_flow_improvement_plan.md)
- [Onboarding Flow Analysis](./onboarding_flow_analysis.md)
- [State Machine Approach Analysis](./state_machine_approach_analysis.md)
- [AiPrise API Documentation](https://docs.aiprise.com)
- [Zustand Documentation](https://github.com/pmndrs/zustand) 
# State Machine Approach for Onboarding Flow: In-Depth Analysis

## Overview

A state machine approach for the onboarding flow would formalize the flow's states, transitions, and side effects in a structured way. This document explores this alternative in depth, analyzing its benefits, drawbacks, and implementation considerations.

## What is a State Machine?

A state machine is a computational model that defines:
- A finite set of states
- Transitions between those states
- Actions that occur on state transitions

For an onboarding flow, a state machine would explicitly model:
- Each step in the flow as a distinct state
- Valid transitions between steps
- Side effects (API calls, data validation) that must occur during transitions
- Error states and recovery paths

## Conceptual Model for Onboarding Flow

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│             │      │             │      │             │      │             │      │             │
│  INITIAL    │─────▶│  NAMES_STEP │─────▶│ COUNTRY_STEP│─────▶│ ADDRESS_STEP│─────▶│   KYC_STEP  │─────▶ COMPLETE
│             │      │             │      │             │      │             │      │             │
└─────────────┘      └──────┬──────┘      └──────┬──────┘      └──────┬──────┘      └──────┬──────┘
                            │                    │                    │                    │
                            ▼                    ▼                    ▼                    ▼
                     ┌─────────────┐      ┌─────────────┐      ┌─────────────┐      ┌─────────────┐
                     │  NAMES_STEP │      │ COUNTRY_STEP│      │ ADDRESS_STEP│      │   KYC_STEP  │
                     │    ERROR    │      │    ERROR    │      │    ERROR    │      │    ERROR    │
                     └─────────────┘      └─────────────┘      └─────────────┘      └─────────────┘
```

## Pros of State Machine Approach

### 1. Explicit State Management

**Benefit**: The current state of the onboarding process is always explicit and well-defined.

**Example**: Instead of inferring state from multiple sources (UI state, API responses, user object), the state machine would have a single source of truth:

```typescript
const machine = createMachine({
  id: 'onboarding',
  initial: 'initial',
  states: {
    initial: {
      on: { START: 'namesStep' }
    },
    namesStep: {
      on: { 
        NEXT: { target: 'countryStep', guards: ['isNamesValid'] },
        ERROR: 'namesStepError'
      }
    },
    // Other states...
  }
});
```

### 2. Predictable Transitions

**Benefit**: All possible transitions between states are explicitly defined, preventing invalid state changes.

**Example**: The KYC step synchronization issue would be prevented because the state machine would only allow transition to the KYC step if the backend status is verified:

```typescript
const machine = createMachine({
  // ...
  states: {
    // ...
    addressStep: {
      on: { 
        NEXT: {
          target: 'verifyingAddressStep',
          actions: ['saveAddressToBackend']
        }
      }
    },
    verifyingAddressStep: {
      invoke: {
        src: 'verifyBackendStatus',
        onDone: { target: 'kycStep' },
        onError: { target: 'addressStepError' }
      }
    },
    kycStep: {
      // Only reachable after backend verification
    }
  }
});
```

### 3. Centralized Side Effects

**Benefit**: API calls and other side effects are centralized and tied to specific transitions.

**Example**: All API calls would be defined as actions or services in the state machine:

```typescript
const onboardingMachine = createMachine(
  {
    // State definition...
  },
  {
    actions: {
      saveNamesToBackend: (context, event) => {
        // API call to save names
      },
      // Other actions...
    },
    services: {
      verifyBackendStatus: (context) => {
        return fetchUser().then(user => {
          if (user?.account?.ob_status !== 'ADDRESS_STEP') {
            throw new Error('Backend status not updated');
          }
          return user;
        });
      }
    }
  }
);
```

### 4. Improved Error Handling

**Benefit**: Error states and recovery paths are explicitly modeled.

**Example**: Each step would have corresponding error states with clear recovery paths:

```typescript
const machine = createMachine({
  // ...
  states: {
    // ...
    addressStepError: {
      on: {
        RETRY: {
          target: 'addressStep',
          actions: ['clearErrors']
        },
        BACK: 'countryStep'
      }
    }
  }
});
```

### 5. Visualization and Testing

**Benefit**: State machines can be visualized and tested more easily than ad-hoc state management.

**Example**: Tools like XState's visualizer can show all possible states and transitions, making it easier to reason about the flow and identify potential issues.

### 6. Resumability

**Benefit**: Users can easily resume from their last valid state if they close the app or encounter errors.

**Example**: The current state can be persisted and restored:

```typescript
// On app start
const persistedState = localStorage.getItem('onboardingState');
if (persistedState) {
  const state = JSON.parse(persistedState);
  const resolvedState = onboardingMachine.resolveState(State.create(state));
  service.start(resolvedState);
}

// On state change
service.onTransition((state) => {
  if (state.changed) {
    localStorage.setItem('onboardingState', JSON.stringify(state));
  }
});
```

## Cons of State Machine Approach

### 1. Implementation Complexity

**Drawback**: Implementing a state machine requires additional code and concepts.

**Example**: The team would need to learn state machine concepts and possibly a new library like XState:

```typescript
import { createMachine, interpret } from 'xstate';

// Machine definition
const onboardingMachine = createMachine({
  // Complex configuration...
});

// Service creation
const onboardingService = interpret(onboardingMachine);

// Starting the service
onboardingService.start();

// Sending events
onboardingService.send({ type: 'NEXT', data: formValues });
```

### 2. Learning Curve

**Drawback**: Team members unfamiliar with state machines would need time to understand the pattern.

**Example**: Debugging issues might initially be more difficult as developers need to understand how the state machine processes events and transitions.

### 3. Integration with Existing Code

**Drawback**: Integrating a state machine into the existing codebase would require significant refactoring.

**Example**: The current step-based UI would need to be connected to the state machine:

```typescript
function OnBoarding() {
  const [state, send] = useMachine(onboardingMachine);
  
  // Map state machine states to UI steps
  const currentStep = {
    'namesStep': 0,
    'countryStep': 1,
    'addressStep': 2,
    'kycStep': 3
  }[state.value] || 0;
  
  // Handle next button click
  const handleNext = () => {
    send('NEXT', { formValues });
  };
  
  // Rest of component...
}
```

### 4. Time Investment

**Drawback**: Implementing a full state machine would take more time than targeted fixes.

**Example**: The team would need to:
1. Define all states and transitions
2. Refactor API calls as actions
3. Connect UI components to the state machine
4. Test all possible paths

### 5. Potential Overengineering

**Drawback**: For simpler flows, a state machine might be more complexity than needed.

**Example**: If the onboarding flow rarely changes and has few edge cases, the investment in a state machine might not pay off.

## Implementation Considerations

### 1. Library Selection

Several libraries could be used to implement a state machine:

- **XState**: Full-featured state machine library with visualization tools
  ```typescript
  import { createMachine } from 'xstate';
  
  const machine = createMachine({
    // Configuration
  });
  ```

- **Zustand with State Machine Pattern**: Leverage existing Zustand store with state machine principles
  ```typescript
  import create from 'zustand';
  
  const useOnboardingStore = create((set, get) => ({
    currentState: 'initial',
    formData: {},
    
    // State machine-like transition function
    transition: (event, payload) => {
      const { currentState } = get();
      
      // Define transitions based on current state and event
      switch (currentState) {
        case 'initial':
          if (event === 'START') {
            set({ currentState: 'namesStep' });
          }
          break;
        case 'namesStep':
          if (event === 'NEXT' && isNamesValid(payload)) {
            // Save data to backend
            saveNamesToBackend(payload)
              .then(() => set({ 
                currentState: 'countryStep',
                formData: { ...get().formData, ...payload }
              }))
              .catch(() => set({ currentState: 'namesStepError' }));
          } else if (event === 'ERROR') {
            set({ currentState: 'namesStepError' });
          }
          break;
        // Other state transitions...
      }
    },
    
    // Actions that can be called from components
    startOnboarding: () => get().transition('START'),
    submitNames: (data) => get().transition('NEXT', data),
    // Other actions...
  }));
  ```

- **Custom Implementation**: A lightweight custom solution
  ```typescript
  class OnboardingStateMachine {
    constructor(initialState) {
      this.state = initialState;
      this.transitions = {
        // Define transitions
      };
    }
    
    transition(event, data) {
      // Handle transition
    }
  }
  ```

### 2. Integration Strategy

Options for integrating a state machine:

1. **Incremental Adoption**: Start with a state machine for just the KYC step, then expand
2. **Complete Refactoring**: Replace the entire flow management with a state machine
3. **Parallel Implementation**: Build a new flow with a state machine while maintaining the old one

### 3. State Persistence

Considerations for persisting state:

1. **Local Storage**: For resuming after app close/refresh
2. **Backend State**: Syncing with backend status
3. **Deep Linking**: Supporting entry from different points

## Zustand-Based State Machine Implementation

Since the application already uses Zustand for state management, integrating state machine principles with Zustand would be more straightforward than introducing a completely new library. Here's how it could be implemented:

```typescript
// src/storage/onboardingMachineStore.ts
import create from 'zustand';
import { persist } from 'zustand/middleware';
import { useUserStore } from './userStore';
import { OnboardingStatus } from '@/screens/Onboarding/OnBoarding';
import { api } from '@/api';

// Define state machine types
type OnboardingState = 
  | 'initial'
  | 'namesStep' | 'namesStepError'
  | 'countryStep' | 'countryStepError'
  | 'addressStep' | 'addressStepError'
  | 'verifyingAddressStep'
  | 'kycStep' | 'kycStepError'
  | 'complete';

type OnboardingEvent = 
  | { type: 'START' }
  | { type: 'NEXT', data: any }
  | { type: 'BACK' }
  | { type: 'ERROR', error: string }
  | { type: 'RETRY' }
  | { type: 'STATUS_VERIFIED' }
  | { type: 'STATUS_FAILED' };

interface OnboardingMachineState {
  currentState: OnboardingState;
  formData: Record<string, any>;
  error: string | null;
  isLoading: boolean;
  
  // Actions
  transition: (event: OnboardingEvent) => void;
  startOnboarding: () => void;
  submitStep: (data: any) => Promise<void>;
  goBack: () => void;
  retry: () => void;
  
  // Selectors
  canProceedToNext: () => boolean;
  getCurrentStepIndex: () => number;
}

export const useOnboardingMachineStore = create<OnboardingMachineState>()(
  persist(
    (set, get) => ({
      currentState: 'initial',
      formData: {},
      error: null,
      isLoading: false,
      
      transition: (event) => {
        const { currentState, formData } = get();
        const { fetchUser } = useUserStore.getState();
        
        set({ isLoading: true, error: null });
        
        switch (currentState) {
          case 'initial':
            if (event.type === 'START') {
              set({ currentState: 'namesStep', isLoading: false });
            }
            break;
            
          case 'namesStep':
            if (event.type === 'NEXT') {
              // Save names to backend
              api.onboardingNamesStep({
                body: {
                  name: event.data.first_name,
                  last_name: event.data.last_name,
                },
                onSuccess: () => {
                  set({ 
                    currentState: 'countryStep',
                    formData: { ...formData, ...event.data },
                    isLoading: false
                  });
                },
                onError: (error) => {
                  set({ 
                    currentState: 'namesStepError',
                    error: error.message || 'Failed to save names',
                    isLoading: false
                  });
                }
              });
            }
            break;
            
          // ... other state transitions
          
          case 'addressStep':
            if (event.type === 'NEXT') {
              // Save address to backend
              api.onboardingAddressStep({
                body: {
                  street_line_1: event.data.address_street_1,
                  city: event.data.address_city,
                  state: event.data.address_state,
                  postal_code: event.data.address_postal_code || "00000",
                },
                onSuccess: () => {
                  set({ 
                    currentState: 'verifyingAddressStep',
                    formData: { ...formData, ...event.data },
                  });
                  
                  // Start verification process
                  const verifyStatus = async () => {
                    try {
                      await fetchUser();
                      const { user } = useUserStore.getState();
                      
                      if (user?.account?.ob_status === OnboardingStatus.ADDRESS_STEP) {
                        get().transition({ type: 'STATUS_VERIFIED' });
                      } else {
                        // Retry after delay
                        setTimeout(verifyStatus, 2000);
                      }
                    } catch (error) {
                      get().transition({ 
                        type: 'ERROR', 
                        error: 'Failed to verify status'
                      });
                    }
                  };
                  
                  verifyStatus();
                },
                onError: (error) => {
                  set({ 
                    currentState: 'addressStepError',
                    error: error.message || 'Failed to save address',
                    isLoading: false
                  });
                }
              });
            }
            break;
            
          case 'verifyingAddressStep':
            if (event.type === 'STATUS_VERIFIED') {
              set({ 
                currentState: 'kycStep',
                isLoading: false
              });
            } else if (event.type === 'ERROR') {
              set({
                currentState: 'addressStepError',
                error: event.error,
                isLoading: false
              });
            }
            break;
            
          // ... other state transitions
        }
      },
      
      startOnboarding: () => {
        get().transition({ type: 'START' });
      },
      
      submitStep: async (data) => {
        get().transition({ type: 'NEXT', data });
      },
      
      goBack: () => {
        get().transition({ type: 'BACK' });
      },
      
      retry: () => {
        get().transition({ type: 'RETRY' });
      },
      
      canProceedToNext: () => {
        const { currentState } = get();
        return !currentState.includes('Error') && currentState !== 'verifyingAddressStep';
      },
      
      getCurrentStepIndex: () => {
        const { currentState } = get();
        const stepMap = {
          'initial': 0,
          'namesStep': 0, 'namesStepError': 0,
          'countryStep': 1, 'countryStepError': 1,
          'addressStep': 2, 'addressStepError': 2, 'verifyingAddressStep': 2,
          'kycStep': 3, 'kycStepError': 3,
          'complete': 4
        };
        return stepMap[currentState] || 0;
      }
    }),
    {
      name: 'onboarding-machine-storage',
      partialize: (state) => ({ 
        currentState: state.currentState,
        formData: state.formData
      })
    }
  )
);
```

### Using the Zustand State Machine in Components

```typescript
// src/screens/Onboarding/OnBoarding.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { useOnboardingMachineStore } from '@/storage/onboardingMachineStore';
import NamesStep from '@/components/Onboarding/NamesStep';
import CountryStep from '@/components/Onboarding/CountryStep';
import AddressStep from '@/components/Onboarding/AddressStep';
import KYCRedirectStep from '@/components/Onboarding/KYCRedirectStep';
import Button from '@/components/Button';
import FullScreenLoader from '@/components/FullScreenLoader';

const OnBoarding = () => {
  const { 
    currentState, 
    formData, 
    error, 
    isLoading,
    submitStep,
    goBack,
    retry,
    getCurrentStepIndex,
    canProceedToNext
  } = useOnboardingMachineStore();
  
  // Render appropriate step based on current state
  const renderStep = () => {
    // Show error states with retry option
    if (currentState.includes('Error')) {
      return (
        <View className="flex-1 justify-center items-center p-layout">
          <Text className="heading-s text-gray-10 mb-4 text-center">
            Error
          </Text>
          <Text className="body-s text-gray-40 mb-8 text-center">
            {error || 'An error occurred'}
          </Text>
          <Button onPress={retry}>
            <Text className="body-m">Try Again</Text>
          </Button>
        </View>
      );
    }
    
    // Show verification loading state
    if (currentState === 'verifyingAddressStep') {
      return <FullScreenLoader text="Verifying your information..." />;
    }
    
    // Render appropriate step component
    switch (getCurrentStepIndex()) {
      case 0:
        return <NamesStep 
          formValues={formData} 
          onSubmit={(data) => submitStep(data)} 
        />;
      case 1:
        return <CountryStep 
          formValues={formData} 
          onSubmit={(data) => submitStep(data)} 
        />;
      case 2:
        return <AddressStep 
          formValues={formData} 
          onSubmit={(data) => submitStep(data)} 
        />;
      case 3:
        return <KYCRedirectStep 
          formValues={formData} 
          onSubmit={(data) => submitStep(data)} 
        />;
      default:
        return null;
    }
  };
  
  return (
    <View className="flex-1">
      {isLoading && <FullScreenLoader text="Processing..." />}
      {renderStep()}
      
      <View className="flex-row justify-between p-layout">
        <Button 
          variant="secondary" 
          onPress={goBack}
          disabled={getCurrentStepIndex() === 0}
        >
          <Text>Back</Text>
        </Button>
        
        <Button 
          onPress={() => submitStep(formData)}
          disabled={!canProceedToNext()}
        >
          <Text>Next</Text>
        </Button>
      </View>
    </View>
  );
};

export default OnBoarding;
```

## Hybrid Approach: Targeted State Machine

A middle ground would be to implement a targeted state machine just for the problematic KYC transition:

```typescript
// src/components/Onboarding/KYCRedirectStep.tsx
import { useState, useEffect } from 'react';
import { useNavigation } from "@react-navigation/native";
import { OnBoardingStepProps } from './config';
import { View, Text } from 'react-native';
import { useUserStore } from "@/storage/";
import { OnboardingStatus } from "@/screens/Onboarding/OnBoarding";
import Button from "@/components/Button";
import FullScreenLoader from "@/components/FullScreenLoader";
import create from 'zustand';

// Small state machine just for KYC transition
const useKycTransitionStore = create((set, get) => ({
  state: 'idle', // idle, checking, waiting, ready, error
  error: null,
  retries: 0,
  
  startChecking: async () => {
    const { fetchUser } = useUserStore.getState();
    
    set({ state: 'checking', error: null });
    
    try {
      await fetchUser();
      const { user } = useUserStore.getState();
      
      if (user?.account?.ob_status === OnboardingStatus.ADDRESS_STEP) {
        set({ state: 'ready' });
      } else {
        // Not ready yet, start waiting
        set({ state: 'waiting' });
        
        // Schedule next check
        setTimeout(() => {
          const { retries } = get();
          if (retries < 3) {
            set({ retries: retries + 1 });
            get().startChecking();
          } else {
            set({ 
              state: 'error', 
              error: 'Unable to verify your account status after multiple attempts.' 
            });
          }
        }, 2000);
      }
    } catch (error) {
      set({ 
        state: 'error', 
        error: 'An error occurred while verifying your account status.' 
      });
    }
  },
  
  retry: () => {
    set({ retries: 0 });
    get().startChecking();
  }
}));

const KYCRedirectStep = ({ formValues, onValidationChange }: OnBoardingStepProps) => {
  const navigation = useNavigation();
  const { state, error, startChecking, retry } = useKycTransitionStore();
  
  // Set validation to true so the next button is enabled
  useEffect(() => {
    onValidationChange(true);
  }, []);
  
  // Start checking status when component mounts
  useEffect(() => {
    startChecking();
  }, []);
  
  // Navigate to KYC when ready
  useEffect(() => {
    if (state === 'ready') {
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
  }, [state]);
  
  if (state === 'checking' || state === 'waiting') {
    return <FullScreenLoader text="Preparing verification..." />;
  }
  
  if (state === 'error') {
    return (
      <View className="flex-1 justify-center items-center p-layout">
        <Text className="heading-s text-gray-10 mb-4 text-center">
          Verification Error
        </Text>
        <Text className="body-s text-gray-40 mb-8 text-center">
          {error}
        </Text>
        <Button onPress={retry}>
          <Text className="body-m">Try Again</Text>
        </Button>
      </View>
    );
  }
  
  // This should rarely be seen as we either show loader or error, or navigate away
  return <View />;
};

export default KYCRedirectStep;
```

This would provide the benefits of a state machine for the critical part of the flow without requiring a complete rewrite.

## Conclusion

### When to Choose a State Machine Approach

A state machine approach would be most beneficial when:

1. The onboarding flow is expected to grow more complex over time
2. There are many edge cases and error states to handle
3. The team has the time and resources to implement it properly
4. The flow needs to be highly reliable and predictable

### When to Choose Targeted Fixes

Targeted fixes (as proposed in the improvement plan) would be more appropriate when:

1. There is a tight timeline (2 days in this case)
2. The issues are well-understood and localized
3. The team needs to minimize changes to the existing codebase
4. The current architecture is generally sound but has specific issues

### Recommendation

For the immediate issue with a 2-day timeline, the targeted fixes approach is more practical. However, implementing a state machine should be considered for a future refactoring to provide a more robust long-term solution.

A phased approach could work well:
1. Implement the targeted fixes to resolve the immediate issues
2. Plan for a Zustand-based state machine implementation as a future enhancement
3. Consider a hybrid approach in the medium term, applying state machine principles to the most critical parts of the flow 
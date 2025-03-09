# Onboarding State Machine Architecture Implementation Design Document

## Current Context

- The onboarding flow is currently implemented as a series of FastAPI endpoints in `app/api/v1/endpoints/onboarding.py`
- The architecture follows a traditional REST API approach with a layered structure (Presentation Layer, Data Access Layer, Domain Model)
- The system lacks proper state validation between steps, leading to synchronization issues
- Business logic is mixed with API handling in endpoint functions
- The KYC verification process is particularly problematic due to asynchronous nature
- Error handling is inconsistent and provides minimal context

## Requirements

### Functional Requirements

- Implement a state machine to manage onboarding flow transitions
- Enforce valid state transitions at the domain level
- Centralize business logic in a dedicated service layer
- Provide consistent error handling with detailed context
- Support all existing onboarding steps (names, country, address, KYC)
- Maintain backward compatibility with existing API contracts
- Validate input data based on business rules
- Ensure data consistency across related entities (account, address)

### Non-Functional Requirements

- Response times should remain under 300ms for all operations
- The implementation should support at least 100 concurrent onboarding sessions
- All state transitions must be atomic and consistent
- The system should be testable with at least 80% code coverage
- Error messages should be clear and actionable for frontend developers
- The implementation should be extensible for future onboarding steps
- Documentation should be comprehensive and up-to-date

## Design Decisions

### 1. State Machine Implementation

Will implement a dedicated `OnboardingStateMachine` class because:

- Provides a clear model of the onboarding process
- Centralizes state transition rules in one place
- Makes the system's behavior more predictable and testable
- Enables visualization and documentation of the flow
- Simplifies adding new states or transitions in the future

Trade-offs considered:
- Increased complexity compared to simple status enum
- Additional overhead for state validation
- Learning curve for developers

### 2. Service Layer Architecture

Will implement an `OnboardingService` class because:

- Separates business logic from API handling
- Centralizes validation and business rules
- Provides a consistent interface for all onboarding operations
- Improves testability of business logic
- Enables better error handling

Trade-offs considered:
- Additional layer of abstraction
- More code to maintain
- Potential performance overhead from additional function calls

### 3. Error Handling Strategy

Will implement custom exception types and a centralized error handler because:

- Provides consistent error responses across endpoints
- Enables detailed error context for debugging
- Improves frontend error handling capabilities
- Separates error handling from business logic

Trade-offs considered:
- More complex error handling code
- Additional exception types to maintain
- Potential learning curve for API consumers

### 4. Transaction Management

Will implement explicit transaction boundaries for multi-entity operations because:

- Ensures data consistency across related entities
- Prevents partial updates in case of failures
- Simplifies rollback in error scenarios
- Improves system reliability

Trade-offs considered:
- Slightly more complex code
- Potential for longer-held database connections
- Need for careful transaction scope management

## Technical Design

### 1. Core Components

```python
class OnboardingStateMachine:
    """
    Manages the state transitions for the onboarding process.
    Defines valid transitions between states and validation rules.
    """
    def __init__(self):
        self.transitions: List[StateTransition] = self._setup_transitions()
        
    def can_transition(self, from_state: OnboardingStatus, 
                       to_state: OnboardingStatus, 
                       context: Dict[str, Any] = None) -> bool:
        """Check if a transition from one state to another is valid"""
        pass
        
    def get_next_states(self, current_state: OnboardingStatus) -> List[OnboardingStatus]:
        """Get all possible next states from the current state"""
        pass
```

```python
class OnboardingService:
    """
    Service layer for onboarding operations.
    Encapsulates business logic and validation rules.
    """
    def __init__(self, account_crud: AccountCRUD, 
                 state_machine: OnboardingStateMachine = None):
        self.account_crud = account_crud
        self.state_machine = state_machine or OnboardingStateMachine()
        
    async def process_names_step(self, user_id: UUID, 
                                data: OnboardingNamesStep) -> Account:
        """Process the names step of onboarding"""
        pass
        
    async def process_country_step(self, user_id: UUID, 
                                  data: OnboardingCountryStep) -> Account:
        """Process the country step of onboarding"""
        pass
```

```python
class OnboardingError(Exception):
    """Base exception for onboarding errors"""
    def __init__(self, message: str, error_code: str = None, 
                 details: Dict[str, Any] = None):
        self.message = message
        self.error_code = error_code
        self.details = details or {}
        super().__init__(message)
```

### 2. Data Models

```python
class StateTransition:
    """
    Represents a valid transition between two onboarding states.
    Includes a guard function to validate the transition.
    """
    def __init__(self, from_state: OnboardingStatus, 
                 to_state: OnboardingStatus, 
                 guard: Callable[[Dict[str, Any]], bool] = None,
                 description: str = None):
        self.from_state = from_state
        self.to_state = to_state
        self.guard = guard or (lambda context: True)
        self.description = description or f"Transition from {from_state} to {to_state}"
        
    def can_execute(self, context: Dict[str, Any]) -> bool:
        """Check if this transition can be executed given the context"""
        return self.guard(context)
```

```python
# Existing models to be used:
# - OnboardingStatus from app.models.account
# - Account from app.models.account
# - Address from app.models.address
```

### 3. Integration Points

- **API Endpoints**: The service layer will be integrated with existing FastAPI endpoints
- **Database**: The service will use the existing CRUD operations for data access
- **Error Handling**: A centralized error handler will convert service exceptions to HTTP responses

**Data Flow**:
1. API endpoint receives request
2. Endpoint calls service method
3. Service validates state transition
4. Service performs business logic
5. Service updates database via CRUD operations
6. Service returns updated entity
7. Endpoint returns HTTP response

## Implementation Plan

1. Phase 1A: State Machine Implementation (2 weeks)

   - Implement `StateTransition` class
   - Implement `OnboardingStateMachine` class
   - Define all valid transitions and guards
   - Write unit tests for state machine
   - Create visualization of the state machine

2. Phase 1B: Service Layer Implementation (2 weeks)

   - Implement custom exception types
   - Implement `OnboardingService` class
   - Move business logic from endpoints to service
   - Implement validation methods
   - Write unit tests for service methods

3. Phase 1C: Endpoint Refactoring (2 weeks)
   - Implement centralized error handler
   - Refactor `/names-step` endpoint
   - Refactor `/country-step` endpoint
   - Refactor `/address-step` endpoint
   - Refactor `/kyc-step` endpoint
   - Update API documentation
   - Write integration tests

## Testing Strategy

### Unit Tests

- **State Machine Tests**:
  - Test all valid transitions
  - Test all invalid transitions
  - Test guard functions with various contexts
  - Test helper methods (get_next_states, get_transition_description)

- **Service Layer Tests**:
  - Test each service method with valid inputs
  - Test each service method with invalid inputs
  - Test error scenarios (not found, validation errors, state errors)
  - Test transaction management

### Integration Tests

- **Endpoint Tests**:
  - Test complete onboarding flow
  - Test error handling
  - Test concurrent operations
  - Test backward compatibility

- **Test Data Requirements**:
  - Mock user accounts
  - Sample valid and invalid inputs for each step
  - Various initial states for testing transitions

## Observability

### Logging

- **Key Logging Points**:
  - State transitions (success and failure)
  - Service method entry and exit
  - Validation errors
  - Database operations

- **Log Levels**:
  - INFO: Successful operations
  - WARNING: Potential issues (e.g., unexpected state)
  - ERROR: Operation failures
  - DEBUG: Detailed execution information

- **Structured Logging Format**:
  ```json
  {
    "timestamp": "ISO8601",
    "level": "INFO|WARNING|ERROR|DEBUG",
    "service": "onboarding",
    "user_id": "UUID",
    "operation": "method_name",
    "from_state": "state_name",
    "to_state": "state_name",
    "message": "Human readable message",
    "details": {}
  }
  ```

### Metrics

- **Key Metrics**:
  - State transition counts (by from_state, to_state)
  - Service method latency
  - Error counts (by error_code)
  - Onboarding completion rate
  - Step completion times

- **Collection Method**:
  - Prometheus metrics
  - Structured logs analysis

- **Alert Thresholds**:
  - Error rate > 5% of requests
  - Service method latency > 500ms
  - Onboarding completion rate < 80%

## Future Considerations

### Potential Enhancements

- Add event emission for state changes (Phase 2)
- Implement webhook support for KYC provider callbacks
- Add idempotency support for all operations
- Implement a status polling endpoint
- Create a visual dashboard for onboarding flow monitoring

### Known Limitations

- Initial implementation doesn't include event notifications
- No support for parallel steps in the onboarding flow
- Limited support for resuming interrupted flows
- No automatic retry mechanism for failed operations

## Dependencies

### Runtime Dependencies

- FastAPI (existing)
- SQLModel/SQLAlchemy (existing)
- Pydantic (existing)
- Python 3.9+ (for improved type hints)

### Development Dependencies

- Pytest for testing
- Black for code formatting
- Mypy for type checking
- Documentation tools (Sphinx or MkDocs)

## Security Considerations

- Ensure proper authorization checks in service methods
- Validate all input data to prevent injection attacks
- Audit log all state transitions for compliance
- Ensure sensitive data is properly protected
- Implement rate limiting for API endpoints

## Rollout Strategy

1. **Development Phase** (6 weeks)
   - Implement all components
   - Write comprehensive tests
   - Review code and documentation

2. **Testing Phase** (2 weeks)
   - Deploy to test environment
   - Run integration tests
   - Perform load testing
   - Fix issues

3. **Staging Deployment** (1 week)
   - Deploy to staging environment
   - Test with real data
   - Verify backward compatibility
   - Monitor performance

4. **Production Deployment** (1 week)
   - Deploy with feature flag
   - Gradually increase traffic to new implementation
   - Monitor closely for issues
   - Be prepared to rollback if necessary

5. **Monitoring Period** (2 weeks)
   - Monitor metrics and logs
   - Gather feedback from frontend team
   - Address any issues
   - Document lessons learned

## References

- [Onboarding Flow Analysis](design_docs/onboarding_analysis.md)
- [State Machine Pattern](https://refactoring.guru/design-patterns/state)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLModel Documentation](https://sqlmodel.tiangolo.com/) 
# Zeneca Mobile Architecture Overview

## 1. Core Technology Stack

### Frontend Framework

- **React Native with Expo (SDK 51)**
- **TypeScript** for type safety and developer experience
- **NativeWind** (Tailwind CSS for React Native) for styling
- **Expo Router** for file-based navigation

### State Management

- **Zustand** for global state with MMKV persistence
  - Specialized stores for user, KYC, assets, market hours, etc.
  - Middleware for devtools and persistence
- **TanStack Query** (React Query v5)
  - Server state management
  - AsyncStorage persistence
  - Automatic background revalidation

### Auth Integration

- **Clerk** for authentication and user management
  - Multi-provider authentication (social, email, phone)
  - Session management and security
  - User profile and metadata management

### Monitoring & Analytics

- **Sentry** for error tracking and performance monitoring
- **PostHog** for user analytics and event tracking

## 2. Application Architecture

### Directory Structure

```
app/                      # Main application (Expo Router)
├── (authenticated)/      # Protected routes
├── (onboarding)/        # Onboarding flow
├── (public)/            # Public routes
├── _layout.tsx          # Root layout
└── index.tsx            # Entry point

src/
├── components/          # Reusable UI components
├── hooks/              # Custom React hooks
├── storage/            # Zustand stores
├── lib/               # Core utilities
├── config/            # Environment configuration
└── constants/         # Application constants
```

### Navigation Structure

- File-based routing with Expo Router
- Route groups for authentication states
- Modal and stack navigation patterns
- Deep linking support
- Type-safe navigation with TypeScript

## 3. State Management Architecture

### Global State (Zustand)

- **userStore**: Authentication and user profile
- **kycStatusStore**: KYC verification status
- **assetsStore**: Asset management
- **marketHourStore**: Market operation hours
- **transferStore**: Transfer operations
- **chainStore**: Blockchain network selection

### Server State (React Query)

- Automatic caching and revalidation
- Optimistic updates
- Background polling
- Error handling and retries

## 5. Security Architecture

### Authentication

- Multi-factor authentication
- Email OTP verification
- OAuth integration
- Session management

### Data Protection

- MMKV encrypted storage
- Secure key management
- Protected routes
- Input validation with Zod

## 6. Performance Optimizations

### React Optimizations

- Component memoization
- Lazy loading
- Code splitting
- Virtual list rendering

### Asset Optimization

- Image optimization
- Font preloading
- Bundle size optimization
- Cache management

## 7. Development Workflow

### Code Quality

- TypeScript strict mode
- ESLint configuration
- Prettier formatting
- Husky pre-commit hooks

### Testing Strategy

- Unit testing with Jest
- Component testing with React Native Testing Library
- E2E testing capabilities
- Performance testing

## 8. Key Features

### Authentication & Onboarding

- Social and email authentication
- KYC verification flow
- Wallet creation and management
- User profile management

### Asset Management

- ETF trading
- Crypto deposits
- Bank transfers
- Order history tracking

### Security Features

- Biometric authentication
- PIN protection
- Transaction signing
- Session management

## 9. Scalability Considerations

### Performance

- Optimized bundle size
- Efficient state management
- Lazy loading strategies
- Caching mechanisms

### Maintainability

- Modular architecture
- Clear separation of concerns
- Consistent coding patterns
- Comprehensive documentation

### Future Extensibility

- Pluggable authentication providers
- Extensible blockchain support
- Modular feature architecture
- API versioning support

---

This architecture provides a robust foundation for a mobile application focused on cryptocurrency and ETF trading, with strong security features, modern UI components, and comprehensive state management. The use of modern technologies and best practices ensures scalability and maintainability as the application grows.

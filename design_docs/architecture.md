# Zeneca Mobile Architecture Overview

## 1. Technology Stack

### Core Technologies
- **React Native**: The app is built using React Native with Expo (version 51.0.39)
- **TypeScript**: The entire codebase is written in TypeScript for type safety
- **Navigation**: Uses React Navigation (native-stack and bottom-tabs) for screen management
- **State Management**: 
  - Zustand for global state management with MMKV storage persistence
  - React Query for server state management with AsyncStorage persistence

### UI/Styling
- **TailwindCSS**: Uses NativeWind (v4.1.21) for styling components
- **Fonts**: Manrope font family from Google Fonts
- **Components**: Mix of custom components and libraries like Bottom Sheet

### Authentication & Web3
- **Privy**: Used for authentication and wallet management (`@privy-io/expo`)
- **Wagmi/Viem**: For blockchain interactions and wallet connectivity
- **Chains**: Supports Ethereum networks (sepolia, baseSepolia, base)

### API & Data Handling
- **API Client**: Generated from OpenAPI specs using `@hey-api/openapi-ts`
- **Data Fetching**: TanStack Query (React Query v5) with persistence
- **Form Handling**: React Hook Form with Zod validation

### Monitoring & Analytics
- **Error Tracking**: Sentry for error monitoring
- **Analytics**: PostHog for user analytics

## 2. Application Structure

### Directory Organization
```
src/                      # Main source code directory
├── components/           # Reusable UI components
├── screens/              # Screen components organized by feature
├── navigation/           # Navigation configuration and types
├── storage/              # State management with Zustand stores
├── hooks/                # Custom React hooks
├── client/               # API client and generated services
├── lib/                  # Utility libraries and helpers
├── utils/                # Utility functions
├── i18n/                 # Internationalization setup
├── styles/               # Global styles
└── constants/            # Application constants
```

### Key Files
- `src/index.tsx`: Main application entry point
- `src/screens/MainNavigation.tsx`: Main navigation configuration
- `src/components/Providers.tsx`: Global providers setup

## 3. Navigation Structure

The app uses a stack-based navigation system with the following main screens:

### Authentication Flow
- **Login**
- **LoginOptions**
- **LoginWithEmail**
- **EmailOtpValidation**

### Main Screens
- **Home** (main dashboard)
- **Profile**
- **ExploreETFs**

### ETF Management
- **ETFDetail**
- **ETFPurchase**
- **ETFPurchaseConfirmation**
- **ETFPurchaseSuccess**
- **ETFSell**
- **ETFSellConfirmation**
- **ETFSellSuccess**

### Deposit Flow
- **DepositWithBank**
- **DepositCrypto**

### KYC Verification
- **KYCPreview**
- **KYCProvider**
- **KYCSuccess**

### Onboarding
- **OnBoarding**

### Order Management
- **OrderHistory**
- **OrderHistoryDetail**

## 4. State Management

### Global State (Zustand)
| Store | Purpose |
|-------|---------|
| **userStore** | Manages user authentication state |
| **assetsStore** | Manages asset data |
| **kycStatusStore** | Manages KYC verification status |
| **chainStore** | Manages blockchain network selection |
| **marketHourStore** | Manages market hours information |
| **loginStore** | Manages login state |
| **quoteStore** | Manages quote data |
| **recipientStore** | Manages recipient information |
| **transferStore** | Manages transfer data |

### API State (React Query)
- Uses TanStack Query for server state management
- Implements persistence with AsyncStorage

## 5. Authentication & Security

- Uses Privy for authentication and wallet management
- Implements secure storage with expo-secure-store
- Supports email login with OTP verification
- Integrates with blockchain wallets

## 6. Key Features

- ✅ **ETF Trading**: Purchase and sell ETFs
- 💰 **Crypto Deposits**: Deposit cryptocurrency
- 🏦 **Bank Deposits**: Deposit via bank transfers
- 🔐 **KYC Verification**: User identity verification
- 📊 **Portfolio Management**: View and manage investments
- 📜 **Order History**: Track transaction history

## 7. Development & Deployment

- Uses Expo for development and building
- Implements ESLint and Prettier for code quality
- Uses Husky and lint-staged for pre-commit hooks
- Supports multiple environments (development, preview, production)
- Uses Expo Updates for over-the-air updates

---

This architecture provides a robust foundation for a mobile application focused on cryptocurrency and ETF trading, with strong security features, modern UI components, and comprehensive state management.
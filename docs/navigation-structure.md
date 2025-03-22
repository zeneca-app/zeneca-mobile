# Zeneca Mobile App Navigation Structure

## Overview

The Zeneca mobile app uses Expo Router for navigation, which implements file-based routing. The navigation is structured into several route groups and screens that represent different sections of the application.

## Authentication Flow

- **/** (index.tsx) - Entry point/Landing page
- **/login.tsx** - User login screen
- **/signup.tsx** - User signup screen
- **/email-signup.tsx** - Email-based signup screen
- **/verify/[email].tsx** - Email verification screen (dynamic route with email parameter)

## Onboarding Flow - (onboarding)

- **/steps.tsx** - Onboarding steps
- **/kyc-preview.tsx** - Preview of KYC process
- **/kyc-provider.tsx** - KYC provider integration
- **/success.tsx** - Onboarding completion

## Authenticated Area - (main)

Main tabs/screens:

- **/home.tsx** - Home screen/dashboard
- **/explore.tsx** - Explore/discovery screen
- **/profile.tsx** - User profile

### Deposit Flow

- **/deposit/bank.tsx** - Bank deposit
- **/deposit/crypto.tsx** - Crypto deposit

### Asset Management

- **/asset/detail.tsx** - Asset details screen

#### Asset Purchase Flow

- **/asset/purchase/purchase.tsx** - Initial purchase screen
- **/asset/purchase/confirmation.tsx** - Purchase confirmation
- **/asset/purchase/success.tsx** - Purchase success

#### Asset Sell Flow

- **/asset/sell/sell.tsx** - Initial sell screen
- **/asset/sell/confirmation.tsx** - Sell confirmation
- **/asset/sell/success.tsx** - Sell success

### Order History

- **/order-history/index.tsx** - Orders list
- **/order-history/[id].tsx** - Detailed order view (dynamic route with order ID)

### Modals

- **/modals/lock.tsx** - App lock screen
- **/modals/pin-setup.tsx** - PIN setup modal


## App Hierarchy

```
app/
├── _layout.tsx                   # Root layout
├── index.tsx                     # Landing page
├── login.tsx                     # Login screen
├── signup.tsx                    # Signup screen
├── email-signup.tsx              # Email signup screen
├── verify/
│   └── [email].tsx               # Email verification
├── (onboarding)/                 # Onboarding route group
│   ├── _layout.tsx               # Onboarding layout
│   ├── steps.tsx                 # Onboarding steps
│   ├── kyc-preview.tsx           # KYC preview
│   ├── kyc-provider.tsx          # KYC provider
│   └── success.tsx               # Onboarding success
└── (main)/              # Authenticated route group
    ├── _layout.tsx               # Authenticated layout
    ├── home.tsx                  # Home screen
    ├── explore.tsx               # Explore screen
    ├── profile.tsx               # Profile screen
    ├── deposit/                  # Deposit flow
    │   ├── _layout.tsx           # Deposit layout
    │   ├── bank.tsx              # Bank deposit
    │   └── crypto.tsx            # Crypto deposit
    ├── asset/                    # Asset management
    │   ├── _layout.tsx           # Asset layout
    │   ├── detail.tsx            # Asset details
    │   ├── purchase/             # Purchase flow
    │   │   ├── _layout.tsx       # Purchase layout
    │   │   ├── purchase.tsx      # Purchase screen
    │   │   ├── confirmation.tsx  # Confirmation screen
    │   │   └── success.tsx       # Success screen
    │   └── sell/                 # Sell flow
    │       ├── _layout.tsx       # Sell layout
    │       ├── sell.tsx          # Sell screen
    │       ├── confirmation.tsx  # Confirmation screen
    │       └── success.tsx       # Success screen
    ├── order-history/            # Order history
    │   ├── _layout.tsx           # Order history layout
    │   ├── index.tsx             # Orders list
    │   └── [id].tsx              # Order details
    └── modals/                   # Modal screens
        ├── _layout.tsx           # Modals layout
        ├── lock.tsx              # Lock screen
        └── pin-setup.tsx         # PIN setup
├── assets/                # Static assets (images, fonts, etc.)
├── components/            # Reusable UI components
│   ├── auth/             # Authentication related components
│   ├── Buttons/          # Button components
│   ├── ETFDetail/        # ETF detail view components
│   ├── Forms/            # Form components
│   ├── HomeScreen/       # Home screen components
│   ├── ListItems/        # List item components
│   ├── Loading/          # Loading indicators
│   ├── login/            # Login specific components
│   ├── Onboarding/      # Onboarding flow components
│   ├── OrderHistory/    # Order history components
│   └── BottomSheet/     # Bottom sheet components
├── config/               # Configuration files
├── constants/            # Constants and enums
├── context/             # React context providers
├── hooks/               # Custom React hooks
├── i18n/                # Internationalization
├── lib/                 # Core libraries and utilities
├── server/              # Server-side code
├── src/                 # Source code
├── storage/             # Storage utilities
├── styles/              # Global styles
├── utils/               # Utility functions
└── hocs/                # Higher-order components
```

## Navigation Patterns

1. **Route Groups**: Parentheses in folder names `(main)`, `(onboarding)` indicate route groups that share common layouts and navigation behavior.

2. **Dynamic Routes**: Square brackets in filenames like `[email].tsx`, `[id].tsx` indicate dynamic routes that accept parameters.

3. **Layouts**: Each section has a `_layout.tsx` file that defines the navigation container and screen options for that section.

4. **Modal Screens**: The `modals/` directory contains screens that are presented modally over the main interface.

5. **Authentication Flow**: The app implements a protection system that redirects unauthenticated users away from protected routes.


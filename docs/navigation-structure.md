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

- **/assets/[id].tsx** - Asset details screen

#### Asset Purchase Flow

- **/assets/purchase.tsx** - Initial purchase screen
- **/assets/purchase-confirmation.tsx** - Purchase confirmation
- **/assets/purchase-success.tsx** - Purchase success

#### Asset Sell Flow

- **/assets/sell.tsx** - Initial sell screen
- **/assets/sell-confirmation.tsx** - Sell confirmation
- **/assets/sell-success.tsx** - Sell success

### Order History

- **/orders/index.tsx** - Orders list
- **/orders/[id].tsx** - Detailed order view (dynamic route with order ID)

### Modals

- **/(modals)/lock.tsx** - App lock screen
- **/(modals)/pin-setup.tsx** - PIN setup modal

## App Hierarchy

```
zeneca-mobile
├─ .cursor
│  └─ rules
│     ├─ 000-cursor-rules.mdc
│     ├─ 001-navigation-reference.mdc
│     ├─ architecture.mdc
│     ├─ conventional-commits.mdc
│     ├─ cursor-rules.mdc
│     ├─ expo.mdc
│     ├─ react-best-practices.mdc
│     ├─ styling.mdc
│     └─ task-management.mdc
├─ .eas
│  └─ build
│     └─ build-and-maestro-test.yml
├─ .eslintignore
├─ .eslintrc.js
├─ .husky
│  ├─ post-merge
│  ├─ pre-commit
│  └─ pre-push
├─ .maestro
│  ├─ flows
│  │  └─ auth.yaml
│  └─ screenshots
├─ .prettierrc
├─ LICENSE
├─ README.md
├─ ReactotronConfig.js
├─ __tests__
│  ├─ app
│  │  └─ signup.test.tsx
│  ├─ hooks
│  │  └─ useAuthRedirect.test.tsx
│  ├─ setup.ts
│  └─ utils
│     ├─ string.test.ts
│     └─ test-utils.tsx
├─ app
│  ├─ (main)
│  │  ├─ (finance)
│  │  │  ├─ _layout.tsx
│  │  │  ├─ assets
│  │  │  │  ├─ [id].tsx
│  │  │  │  ├─ _layout.tsx
│  │  │  │  ├─ purchase-confirmation.tsx
│  │  │  │  ├─ purchase-success.tsx
│  │  │  │  ├─ purchase.tsx
│  │  │  │  ├─ sell-confirmation.tsx
│  │  │  │  ├─ sell-success.tsx
│  │  │  │  └─ sell.tsx
│  │  │  ├─ deposit
│  │  │  │  ├─ _layout.tsx
│  │  │  │  ├─ bank.tsx
│  │  │  │  └─ crypto.tsx
│  │  │  └─ orders
│  │  │     ├─ [id].tsx
│  │  │     ├─ _layout.tsx
│  │  │     └─ index.tsx
│  │  ├─ _layout.tsx
│  │  ├─ explore.tsx
│  │  ├─ index.tsx
│  │  └─ profile.tsx
│  ├─ (modals)
│  │  ├─ _layout.tsx
│  │  ├─ lock.tsx
│  │  └─ pin-setup.tsx
│  ├─ (onboarding)
│  │  ├─ _layout.tsx
│  │  ├─ kyc-preview.tsx
│  │  ├─ kyc-provider.tsx
│  │  ├─ steps.tsx
│  │  └─ success.tsx
│  ├─ _layout.tsx
│  ├─ email-signup.tsx
│  ├─ index.tsx
│  ├─ login.tsx
│  ├─ signup.tsx
│  └─ verify
│     └─ [email].tsx
├─ app.json
├─ assets
│  ├─ android-icon-2.png
│  ├─ android-icon.png
│  ├─ avatar.svg
│  ├─ base-logo.svg
│  ├─ chart-arrow-up.svg
│  ├─ copy.svg
│  ├─ face-id.svg
│  ├─ general-loader.svg
│  ├─ green-gradient-circle.svg
│  ├─ icon.png
│  ├─ id-card.svg
│  ├─ line-home.svg
│  ├─ logo-light.svg
│  ├─ logo-splash.png
│  ├─ progress-bar.svg
│  ├─ splash.png
│  ├─ stocks
│  │  ├─ ADBE.svg
│  │  ├─ AMZN.svg
│  │  ├─ APPL.svg
│  │  ├─ COIN.svg
│  │  ├─ CSCO.svg
│  │  ├─ DIS.svg
│  │  ├─ GBTC.svg
│  │  ├─ GME.svg
│  │  ├─ GOOGL.svg
│  │  ├─ JNJ.svg
│  │  ├─ MCD.svg
│  │  ├─ META.svg
│  │  ├─ MSFT.svg
│  │  ├─ NFLX.svg
│  │  ├─ NVDA.svg
│  │  ├─ PFE.svg
│  │  ├─ PYPL.svg
│  │  ├─ RDDT.svg
│  │  ├─ SPY.svg
│  │  ├─ TSLA.svg
│  │  ├─ UBER.svg
│  │  └─ XOM.svg
│  ├─ usdc.svg
│  ├─ verify-icon.svg
│  ├─ verify-ilustration.svg
│  ├─ zeneca-full-logo.svg
│  ├─ zeneca-gradient-circle.svg
│  ├─ zeneca-logo-bright.svg
│  └─ zeneca-logo-letters.svg
├─ babel.config.js
├─ client
│  ├─ @tanstack
│  │  └─ react-query.gen.ts
│  ├─ client.ts
│  ├─ index.ts
│  ├─ schemas.gen.ts
│  ├─ services.gen.ts
│  └─ types.gen.ts
├─ components
│  ├─ AnimatedInput.tsx
│  ├─ AssetLogo.tsx
│  ├─ AwaitPrivyProvider.tsx
│  ├─ BottomActions.tsx
│  ├─ BottomSheet
│  │  ├─ BottomSheet.tsx
│  │  └─ components
│  │     └─ BottomSheetButton.tsx
│  ├─ Button.tsx
│  ├─ Buttons
│  │  ├─ CryptoNetworkButton.tsx
│  │  ├─ KeypadButton.tsx
│  │  └─ PillButton.tsx
│  ├─ Card.tsx
│  ├─ CardFooter.tsx
│  ├─ CardHeader.tsx
│  ├─ ETFDetail
│  │  ├─ ETFActions.tsx
│  │  ├─ ETFChart.tsx
│  │  ├─ ETFChartUtils.ts
│  │  ├─ ETFDescription.tsx
│  │  └─ ETFHeader.tsx
│  ├─ Forms
│  │  ├─ InputWrapper.tsx
│  │  └─ JumpingInputLabel.tsx
│  ├─ FullScreenLoader.tsx
│  ├─ HomeScreen
│  │  ├─ Balance.tsx
│  │  ├─ HomeActions.tsx
│  │  ├─ PositionsList.tsx
│  │  └─ VerifyCtaCard.tsx
│  ├─ IntroAnimation.tsx
│  ├─ Keypad.tsx
│  ├─ KeypadOld.tsx
│  ├─ ListItems
│  │  ├─ AssetListItem.tsx
│  │  ├─ MyAssetItem.tsx
│  │  └─ Separator.tsx
│  ├─ LoaderSpinner.tsx
│  ├─ Loading
│  │  ├─ AnimatedWavyLine.tsx
│  │  ├─ SkeletonLoadingView.tsx
│  │  └─ index.tsx
│  ├─ LoggedLayout.tsx
│  ├─ MarketHours.tsx
│  ├─ Onboarding
│  │  ├─ CountryStep.tsx
│  │  ├─ DateOfBirthStep.tsx
│  │  ├─ FullAddressStep.tsx
│  │  ├─ FullNameStep.tsx
│  │  ├─ KYCRedirectStep.tsx
│  │  ├─ OnboardingIndicator.tsx
│  │  ├─ config.ts
│  │  └─ useOnboardingMutations.ts
│  ├─ OrderHistory
│  │  ├─ EmptyState.tsx
│  │  ├─ LoadingState.tsx
│  │  ├─ OrderHistoryItem.tsx
│  │  ├─ TabButton.tsx
│  │  └─ index.ts
│  ├─ ProfileButton.tsx
│  ├─ ProgressBar.tsx
│  ├─ Providers.tsx
│  ├─ Text.tsx
│  ├─ TopNavBar.tsx
│  ├─ __tests__
│  │  ├─ Button.test.tsx
│  │  ├─ Card.test.tsx
│  │  └─ __mocks__
│  │     ├─ expo-router.ts
│  │     └─ nativewind.ts
│  ├─ auth
│  │  ├─ AuthButton.tsx
│  │  ├─ AuthContainer.tsx
│  │  └─ AuthHeader.tsx
│  ├─ login
│  │  └─ button.tsx
│  ├─ screenOptions.tsx
│  └─ status-modal.tsx
├─ config
│  ├─ by_stage.ts
│  ├─ env.ts
│  └─ index.ts
├─ constants
│  ├─ basenames.ts
│  ├─ colors.ts
│  ├─ countries.ts
│  ├─ stocks.ts
│  └─ tokens.ts
├─ context
│  ├─ AuthProvider.tsx
│  └─ UserInactivity.tsx
├─ declarations.d.ts
├─ docs
│  ├─ MAESTRO_SETUP.md
│  ├─ TESTING_PLAN.md
│  ├─ analytics
│  │  └─ posthog_events_requirements.md
│  ├─ architecture.md
│  ├─ autentication.md
│  ├─ auth_analysis.md
│  ├─ expo_router_migration.md
│  ├─ navigation-structure.md
│  ├─ onboarding
│  │  ├─ backend_onboarding.md
│  │  ├─ onboarding_architecture_alignment_analysis.md
│  │  ├─ onboarding_flow_analysis.md
│  │  ├─ onboarding_flow_improvement_plan.md
│  │  ├─ prd_hybrid_approach_implementation.md
│  │  └─ state_machine_approach_analysis.md
│  ├─ prd_template.md
│  └─ rules.md
├─ eas.json
├─ global.css
├─ hocs
│  └─ withDisabledStateClasses.tsx
├─ hooks
│  ├─ __tests__
│  ├─ useAuthRedirect.ts
│  ├─ useCamera.ts
│  ├─ useCheckUpdate.ts
│  ├─ useOrders.ts
│  ├─ usePrefetchData.ts
│  └─ useUserServices.tsx
├─ i18n
│  ├─ index.ts
│  └─ locales
│     ├─ en
│     │  └─ translation.json
│     └─ es
│        └─ translation.json
├─ index.js
├─ lib
│  ├─ abis
│  │  ├─ L2ResolverAbi.ts
│  │  └─ orderProcesssorAbi.ts
│  ├─ basenames.ts
│  ├─ dinari.ts
│  ├─ pimlico.ts
│  ├─ polyfills.ts
│  ├─ privy.ts
│  ├─ smart-accounts.ts
│  ├─ storage-adapter.ts
│  ├─ types
│  │  ├─ auth.ts
│  │  ├─ basenames.ts
│  │  ├─ login.ts
│  │  ├─ recipient.ts
│  │  └─ transfer.ts
│  └─ utils
│     ├─ isBase.ts
│     └─ isEthereum.ts
├─ maestro.yaml
├─ metro.config.js
├─ nativewind-env.d.ts
├─ openapi-ts.config.ts
├─ package-lock.json
├─ package.json
├─ scratchpad.md
├─ server
│  ├─ config.ts
│  └─ openapi.json
├─ src
│  ├─ hooks
│  └─ screens
│     ├─ Login
│     │  ├─ LoginOptions.tsx
│     │  ├─ LoginOtpVerification.tsx
│     │  ├─ LoginWithEmail.tsx
│     │  └─ Welcome.tsx
│     ├─ MainNavigation.tsx
│     ├─ Quote
│     │  └─ index.tsx
│     ├─ QuoteConfirmation
│     │  └─ index.tsx
│     ├─ Recipients
│     │  └─ index.tsx
│     ├─ Send
│     │  └─ index.tsx
│     ├─ SendConfirmation
│     │  └─ index.tsx
│     ├─ SendSuccess
│     │  └─ index.tsx
│     └─ TransactionReceipt
│        └─ index.tsx
├─ storage
│  ├─ assetsStore.ts
│  ├─ chainStore.ts
│  ├─ index.ts
│  ├─ interfaces.ts
│  ├─ kycStatusStore.ts
│  ├─ loginStore.ts
│  ├─ marketHourStore.ts
│  ├─ quoteStore.ts
│  ├─ recipientStore.ts
│  ├─ storage.ts
│  ├─ transferStore.ts
│  └─ userStore.ts
├─ styles
│  └─ colors.ts
├─ tailwind.config.js
├─ test
├─ tsconfig.json
└─ utils
   ├─ address.ts
   ├─ clerk.ts
   ├─ currencyUtils.ts
   ├─ date
   │  └─ formatters.ts
   ├─ orders
   │  └─ status.ts
   ├─ prefetchQueries.ts
   ├─ quote.ts
   ├─ string.ts
   ├─ string_utils.ts
   └─ token.ts
```

## Navigation Patterns

1. **Route Groups**: Parentheses in folder names `(main)`, `(onboarding)` indicate route groups that share common layouts and navigation behavior.

2. **Dynamic Routes**: Square brackets in filenames like `[email].tsx`, `[id].tsx` indicate dynamic routes that accept parameters.

3. **Layouts**: Each section has a `_layout.tsx` file that defines the navigation container and screen options for that section.

4. **Modal Screens**: The `(modals)/` directory contains screens that are presented modally over the main interface.

5. **Authentication Flow**: The app implements a protection system that redirects unauthenticated users away from protected routes.

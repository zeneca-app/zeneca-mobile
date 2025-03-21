# ETF Components Refactoring Plan

## Overview
This document outlines the plan to refactor the ETF-related components to improve code reusability, maintainability, and type safety. The refactoring will focus on extracting common patterns, creating shared components, and implementing proper TypeScript types.

## Current Structure
Currently, we have several ETF-related components with duplicated logic:
- ETFPurchaseConfirmation
- ETFSellConfirmation
- ETFPurchaseSuccess
- ETFSellSuccess
- ETFSell

### Common Patterns Identified
1. Quote Management
2. Transaction Execution
3. Timer Management
4. UI Components
5. Navigation Logic
6. Formatting Utilities

## Current Logic Flow

### Purchase Flow
1. User Input & Validation
   ```
   ETFPurchase
   ├── Amount input validation
   ├── Price calculation
   └── Navigation to confirmation
   ```

2. Purchase Confirmation
   ```
   ETFPurchaseConfirmation
   ├── Quote Management
   │   ├── Initial quote fetch
   │   ├── Quote refresh on expiry
   │   └── Quote state management
   │
   ├── Timer Management
   │   ├── Countdown calculation
   │   ├── Timer display
   │   └── Auto-refresh on expiry
   │
   ├── Transaction Execution
   │   ├── Wallet validation
   │   ├── Smart account setup
   │   ├── Transaction submission
   │   └── Receipt verification
   │
   └── State Updates
       ├── Balance invalidation
       ├── Assets invalidation
       └── Navigation to success
   ```

3. Success Screen
   ```
   ETFPurchaseSuccess
   ├── Transaction summary display
   └── Navigation reset to home
   ```

### Sell Flow
1. User Input & Asset Validation
   ```
   ETFSell
   ├── Available balance check
   ├── Amount input validation
   ├── Quantity calculation
   └── Navigation to confirmation
   ```

2. Sell Confirmation
   ```
   ETFSellConfirmation
   ├── Quote Management
   │   ├── Initial quote fetch
   │   ├── Quote refresh on expiry
   │   └── Quote state management
   │
   ├── Timer Management
   │   ├── Countdown calculation
   │   ├── Timer display
   │   └── Auto-refresh on expiry
   │
   ├── Transaction Execution
   │   ├── Wallet validation
   │   ├── Smart account setup
   │   ├── Transaction submission
   │   └── Receipt verification
   │
   └── State Updates
       ├── Balance invalidation
       ├── Assets invalidation
       └── Navigation to success
   ```

3. Success Screen
   ```
   ETFSellSuccess
   ├── Transaction summary display
   └── Navigation reset to home
   ```

### Shared Business Logic
1. Quote Management
   - Quote fetching via TanStack Query mutation
   - Quote state management
   - Quote expiry handling
   - Quote refresh logic

2. Transaction Processing
   - Smart account client initialization
   - Transaction submission
   - Receipt verification
   - Error handling with Sentry
   - Cache invalidation

3. Amount Calculations
   - Currency formatting
   - BigNumber.js calculations
   - Precision handling
   - Unit conversions (wei/eth)

4. UI State Management
   - Loading states
   - Error states
   - Transaction states
   - Timer states

### Data Flow
```
User Input → Validation → Quote Fetch → Timer Start → Transaction Execution → State Update → Success
     ↑          │            │             │               │                    │            │
     └──────────┴────────────┴─────────────┴───────────────┴────────────────────┴────────────┘
                                         Error Handling
```

## Phase 1: Type Definitions and Basic Cleanup

### 1.1 Route and Navigation Types
```typescript
// src/types/navigation.ts
export type ETFRouteParams = {
  ETFPurchaseConfirmation: {
    etf: ETF;
    amount: number;
  };
  ETFSellConfirmation: {
    etf: ETF;
    amount: string;
    quantity: string;
  };
  ETFPurchaseSuccess: {
    etf: ETF;
    amount: number;
    quote: OrderQuote;
  };
  ETFSellSuccess: {
    etf: ETF;
    amount: number;
    quote: OrderQuote;
  };
};

export type ETFScreenProps<T extends keyof ETFRouteParams> = {
  route: {
    params: ETFRouteParams[T];
  };
  navigation: NavigationProp<ETFRouteParams>;
};
```

### 1.2 ETF Data Types
```typescript
// src/types/etf.ts
export interface ETF {
  id: string;
  symbol: string;
  name: string;
  price: number;
  // Add other ETF properties
}

export interface OrderQuote {
  id: string;
  asset_price: number;
  fee: number;
  total_amount: number;
  deadline: number;
  transactions: Transaction[];
  // Add other quote properties
}
```

## Phase 2: Shared Hooks and Utils

### 2.1 Quote Management Hook
```typescript
// src/hooks/useQuoteManagement.ts
export const useQuoteManagement = (params: {
  assetId: string;
  side: 'BUY' | 'SELL';
  amount?: string;
  quantity?: string;
}) => {
  const [quote, setQuote] = useState<OrderQuote | null>(null);
  // Implementation details
};
```

### 2.2 Timer Management Hook
```typescript
// src/hooks/useQuoteTimer.ts
export const useQuoteTimer = (quote: OrderQuote | null) => {
  const [timeLeft, setTimeLeft] = useState(0);
  // Implementation details
};
```

### 2.3 Transaction Execution Utility
```typescript
// src/utils/transactionUtils.ts
export const executeETFTransaction = async (params: {
  quote: OrderQuote;
  wallet: EmbeddedWallet;
  chain: Chain;
}) => {
  // Implementation details
};
```

## Phase 3: Shared Components

### 3.1 ETF Logo Component
```typescript
// src/components/ETF/ETFLogo.tsx
import { STOCKS } from "@/constants/stocks";
import React from "react";
import { View, ViewStyle } from "react-native";

interface ETFLogoProps {
  symbol: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: ViewStyle;
}

const sizeMap = {
  sm: 'w-6 h-6',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
};

export const ETFLogo: React.FC<ETFLogoProps> = ({ 
  symbol, 
  size = 'md',
  className = '',
  style
}) => {
  const Logo = STOCKS?.[symbol as keyof typeof STOCKS]?.logo || null;
  const sizeClass = sizeMap[size];

  if (!Logo) return null;

  return (
    <View 
      className={`${sizeClass} bg-gray-90 rounded-full overflow-hidden ${className}`}
      style={style}
    >
      <Logo style={{ height: "100%", width: "100%" }} />
    </View>
  );
};

// Usage example:
// <ETFLogo symbol={etf.symbol} size="md" />
```

### 3.2 ETF Price Display Component
```
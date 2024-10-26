import React, { createContext, useContext, ReactNode } from 'react';
import { useBalance as useWagmiBalance } from 'wagmi';
import { Address } from 'viem';
import { useChainStore } from "@/storage/chainStore";
import tokens from "@/constants/tokens";
import { useUserStore } from "@/storage/userStore";

interface BalanceContextType {
  balanceFormatted: string;
  balance: ReturnType<typeof useWagmiBalance>['data'];
  isLoadingBalance: boolean;
  refetchBalance: () => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const chain = useChainStore((state) => state.chain);
  const { user: storedUser } = useUserStore((state) => state);

  const {
    data: balance,
    isLoading: isLoadingBalance,
    refetch: refetchBalance,
  } = useWagmiBalance({
    address: storedUser?.wallets[0].smart_account_address as `0x${string}`,
    token: tokens.USDC[chain.id] as Address,
  });

  const balanceFormatted = balance?.formatted ?? "0";

  return (
    <BalanceContext.Provider value={{ balance, balanceFormatted, isLoadingBalance, refetchBalance }}>
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error('useBalanceContext must be used within a BalanceProvider');
  }
  return context;
};
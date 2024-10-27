import tokens from "@/constants/tokens";
import { useChainStore } from "@/storage/chainStore";
import { useUserStore } from "@/storage/userStore";
import React, { createContext, ReactNode, useContext } from "react";
import { Address, zeroAddress } from "viem";
import { useBalance as useWagmiBalance } from "wagmi";

interface BalanceContextType {
  balanceFormatted: string;
  balance: ReturnType<typeof useWagmiBalance>["data"];
  isLoadingBalance: boolean;
  refetchBalance: () => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const chain = useChainStore((state) => state.chain);
  const { user: storedUser } = useUserStore((state) => state);

  const getAddress = () => {
    if (storedUser && storedUser.wallets) {
      return storedUser.wallets[0].smart_account_address as `0x${string}`;
    }
    return zeroAddress;
  };

  const {
    data: balance,
    isLoading: isLoadingBalance,
    refetch: refetchBalance,
  } = useWagmiBalance({
    address: getAddress() as Address,
    token: tokens.USDC[chain.id] as Address,
  });

  const balanceFormatted = balance?.formatted ?? "0";

  return (
    <BalanceContext.Provider
      value={{ balance, balanceFormatted, isLoadingBalance, refetchBalance }}
    >
      {children}
    </BalanceContext.Provider>
  );
};

export const useBalance = () => {
  const context = useContext(BalanceContext);
  if (context === undefined) {
    throw new Error("useBalanceContext must be used within a BalanceProvider");
  }
  return context;
};

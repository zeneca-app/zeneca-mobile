import React, { createContext, useContext, ReactNode, useEffect } from 'react';
import { useBalance as useWagmiBalance } from 'wagmi';
import { Address } from 'viem';
import { useChainStore } from '../storage/chainStore';
import { useWalletStore } from '../storage/walletStore';
import tokens from '../constants/tokens';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface BalanceContextType {
  balanceFormatted: string;
  balance: ReturnType<typeof useWagmiBalance>['data'];
  isLoadingBalance: boolean;
  refetchBalance: () => void;
}

const BalanceContext = createContext<BalanceContextType | undefined>(undefined);

export const BalanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const smartAccountAddress = useWalletStore((state) => state.address);
  const chain = useChainStore((state) => state.chain);
  const setAddress = useWalletStore((state) => state.setAddress);

  const {
    data: balance,
    isLoading: isLoadingBalance,
    refetch: refetchBalance,
  } = useWagmiBalance({
    address: smartAccountAddress,
    token: tokens.USDC[chain.id] as Address,
  });

  const balanceFormatted = balance?.formatted ?? "0";


  useEffect(() => {
    const fetchAddresses = async () => {
      const storedSmartAccountAddress = await AsyncStorage.getItem('smartAccountAddress');
      if (storedSmartAccountAddress) setAddress(storedSmartAccountAddress as `0x${string}`);
    };
    fetchAddresses();
  }, []);

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
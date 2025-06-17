/* eslint-disable @typescript-eslint/no-empty-object-type */
import { AssetPrice, OrderQuote } from "@/client/";

/* eslint-disable @typescript-eslint/no-namespace */
export type RootStackParamList = {
  Welcome: undefined;
  Home: undefined;
  Recipients: undefined;
  Quote: undefined;
  QuoteConfirmation: undefined;
  TransactionReceipt: undefined;
  SendSuccess: undefined;
  LoginOptions: undefined;
  LoginWithEmail: undefined;
  EmailOtpValidation: undefined;
  ExploreAssets: undefined;
  ETFDetail: {
    asset: AssetPrice;
  };
  ETFPurchaseConfirmation: {
    asset: AssetPrice;
    amount: string;
  };
  ETFPurchaseSuccess: {
    asset: AssetPrice;
    amount: string;
    quote: OrderQuote;
  };
  ETFPurchase: {
    asset: AssetPrice;
  };
  KYCPreview: undefined;
  KYCProvider: undefined;
  KYCSuccess: undefined;
  OnBoarding: undefined;
  DepositWithBank: undefined;
  DepositCrypto: undefined;
  Withdrawl: undefined;
  WithdrawlConfirmation: undefined;
  WithdrawlSuccess: undefined;
  Profile: undefined;
  OrderHistory: undefined;
  OrderHistoryDetail: undefined;
  ETFSell: {
    asset: AssetPrice;
  };
  ETFSellConfirmation: {
    asset: AssetPrice;
    amount: string;
    quantity: string;
  };
  ETFSellSuccess: {
    asset: AssetPrice;
    amount: string;
    quote: OrderQuote;
  };
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

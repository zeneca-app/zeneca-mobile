/* eslint-disable @typescript-eslint/no-empty-object-type */
import { AssetPrice } from "@/client/";

/* eslint-disable @typescript-eslint/no-namespace */
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Recipients: undefined;
  Quote: undefined;
  QuoteConfirmation: undefined;
  TransactionReceipt: undefined;
  SendSuccess: undefined;
  LoginOptions: undefined;
  LoginWithEmail: undefined;
  EmailOtpValidation: undefined;
  ExploreETFs: undefined;
  ETFDetail: {
    asset: AssetPrice;
  };
  ETFPurchaseConfirmation: undefined;
  ETFPurchaseSuccess: undefined;
  ETFPurchase: undefined;
  KYCPreview: undefined;
  KYCProvider: undefined;
  KYCSuccess: undefined;
  OnBoarding: undefined;
  DepositWithBank: undefined;
  DepositCrypto: undefined;
  Send: undefined;
  SendConfirmation: undefined;
  Profile: undefined;
  OrderHistory: undefined;
  ETFSell: undefined;
  ETFSellConfirmation: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

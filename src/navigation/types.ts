/* eslint-disable @typescript-eslint/no-empty-object-type */
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
  ETFPurchaseConfirmation: undefined;
  ETFPurchase: undefined;
  ETFDetail: undefined;
  KYCPreview: undefined;
  KYCProvider: undefined;
  KYCSuccess: undefined;
  DepositWithBank: undefined;
  DepositCrypto: undefined;
  Send: undefined;
  SendConfirmation: undefined;
  Profile: undefined;
  OrderHistory: undefined;
  OnBoarding: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

/* eslint-disable @typescript-eslint/no-empty-object-type */
/* eslint-disable @typescript-eslint/no-namespace */
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Recipients: undefined;
  Quote: undefined;
  QuoteConfirmation: undefined;
  TransactionReceipt: undefined;
  MainTabs: undefined;
  SendSuccess: undefined;
  LoginOptions: undefined;
  LoginWithEmail: undefined;
  KYCPreview: undefined;
  KYCModal: undefined;
  KYCSuccess: undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

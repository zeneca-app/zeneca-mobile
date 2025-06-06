// This file is auto-generated by @hey-api/openapi-ts

import {
  createClient,
  createConfig,
  type Options,
} from "@hey-api/client-fetch";
import type {
  AssetsGetAssetDetailData,
  AssetsGetAssetDetailError,
  AssetsGetAssetDetailResponse,
  AssetsGetAssetsData,
  AssetsGetAssetsError,
  AssetsGetAssetsResponse,
  AssetsGetAssetTicksData,
  AssetsGetAssetTicksError,
  AssetsGetAssetTicksResponse,
  AssetsGetMarketHoursError,
  AssetsGetMarketHoursResponse,
  BanksGetBanksData,
  BanksGetBanksError,
  BanksGetBanksResponse,
  CountriesGetCountriesError,
  CountriesGetCountriesResponse,
  HealthCheckError,
  HealthCheckResponse,
  LoginLoginOrCreateData,
  LoginLoginOrCreateError,
  LoginLoginOrCreateResponse,
  OnboardingOnboardingAddressStepData,
  OnboardingOnboardingAddressStepError,
  OnboardingOnboardingAddressStepResponse,
  OnboardingOnboardingCountryStepData,
  OnboardingOnboardingCountryStepError,
  OnboardingOnboardingCountryStepResponse,
  OnboardingOnboardingKycStepError,
  OnboardingOnboardingKycStepResponse,
  OnboardingOnboardingNamesStepData,
  OnboardingOnboardingNamesStepError,
  OnboardingOnboardingNamesStepResponse,
  OrdersCreateQuoteOrderData,
  OrdersCreateQuoteOrderError,
  OrdersCreateQuoteOrderResponse,
  OrdersGetOrdersError,
  OrdersGetOrdersResponse,
  QuotesCreateQuoteData,
  QuotesCreateQuoteError,
  QuotesCreateQuoteResponse,
  QuotesGetQuoteData,
  QuotesGetQuoteError,
  QuotesGetQuoteResponse,
  RecipientsCreateRecipientData,
  RecipientsCreateRecipientError,
  RecipientsCreateRecipientResponse,
  RecipientsGetRecipientData,
  RecipientsGetRecipientError,
  RecipientsGetRecipientResponse,
  RecipientsGetRecipientsError,
  RecipientsGetRecipientsResponse,
  TransfersCreateTransferData,
  TransfersCreateTransferError,
  TransfersCreateTransferResponse,
  TransfersGetTransferData,
  TransfersGetTransferError,
  TransfersGetTransferResponse,
  TransfersGetTransfersError,
  TransfersGetTransfersResponse,
  UsersGetKycStatusError,
  UsersGetKycStatusResponse,
  UsersMeError,
  UsersMeResponse,
  UsersMyAssetByIdData,
  UsersMyAssetByIdError,
  UsersMyAssetByIdResponse,
  UsersMyAssetsError,
  UsersMyAssetsResponse,
  UsersMyBalanceError,
  UsersMyBalanceResponse,
  WebhooksEventFromBridgeReceivedError,
  WebhooksEventFromBridgeReceivedResponse,
  WebhooksEventFromKoyweReceivedError,
  WebhooksEventFromKoyweReceivedResponse,
  WebhooksEventsFromAipriseError,
  WebhooksEventsFromAipriseResponse,
  WebhooksKycEventFromAipriseError,
  WebhooksKycEventFromAipriseResponse,
} from "./types.gen";

export const client = createClient(createConfig());

/**
 * Health Check
 */
export const healthCheck = <ThrowOnError extends boolean = false>(
  options?: Options<unknown, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    HealthCheckResponse,
    HealthCheckError,
    ThrowOnError
  >({
    ...options,
    url: "/health",
  });
};

/**
 * Login Or Create
 */
export const loginLoginOrCreate = <ThrowOnError extends boolean = false>(
  options: Options<LoginLoginOrCreateData, ThrowOnError>,
) => {
  return (options?.client ?? client).post<
    LoginLoginOrCreateResponse,
    LoginLoginOrCreateError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/login_or_create",
  });
};

/**
 * Create Quote
 */
export const quotesCreateQuote = <ThrowOnError extends boolean = false>(
  options: Options<QuotesCreateQuoteData, ThrowOnError>,
) => {
  return (options?.client ?? client).post<
    QuotesCreateQuoteResponse,
    QuotesCreateQuoteError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/quotes/",
  });
};

/**
 * Get Quote
 */
export const quotesGetQuote = <ThrowOnError extends boolean = false>(
  options: Options<QuotesGetQuoteData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    QuotesGetQuoteResponse,
    QuotesGetQuoteError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/quotes/{quote_id}",
  });
};

/**
 * Get Recipient
 */
export const recipientsGetRecipient = <ThrowOnError extends boolean = false>(
  options: Options<RecipientsGetRecipientData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    RecipientsGetRecipientResponse,
    RecipientsGetRecipientError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/recipients/{recipient_id}",
  });
};

/**
 * Get Recipients
 */
export const recipientsGetRecipients = <ThrowOnError extends boolean = false>(
  options?: Options<unknown, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    RecipientsGetRecipientsResponse,
    RecipientsGetRecipientsError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/recipients/",
  });
};

/**
 * Create Recipient
 */
export const recipientsCreateRecipient = <ThrowOnError extends boolean = false>(
  options: Options<RecipientsCreateRecipientData, ThrowOnError>,
) => {
  return (options?.client ?? client).post<
    RecipientsCreateRecipientResponse,
    RecipientsCreateRecipientError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/recipients/",
  });
};

/**
 * Get Banks
 */
export const banksGetBanks = <ThrowOnError extends boolean = false>(
  options: Options<BanksGetBanksData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    BanksGetBanksResponse,
    BanksGetBanksError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/banks/",
  });
};

/**
 * Get Transfers
 */
export const transfersGetTransfers = <ThrowOnError extends boolean = false>(
  options?: Options<unknown, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    TransfersGetTransfersResponse,
    TransfersGetTransfersError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/transfers/",
  });
};

/**
 * Create Transfer
 */
export const transfersCreateTransfer = <ThrowOnError extends boolean = false>(
  options: Options<TransfersCreateTransferData, ThrowOnError>,
) => {
  return (options?.client ?? client).post<
    TransfersCreateTransferResponse,
    TransfersCreateTransferError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/transfers/",
  });
};

/**
 * Get Transfer
 */
export const transfersGetTransfer = <ThrowOnError extends boolean = false>(
  options: Options<TransfersGetTransferData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    TransfersGetTransferResponse,
    TransfersGetTransferError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/transfers/{transaction_id}",
  });
};

/**
 * Event From Koywe Received
 */
export const webhooksEventFromKoyweReceived = <
  ThrowOnError extends boolean = false,
>(
  options?: Options<unknown, ThrowOnError>,
) => {
  return (options?.client ?? client).post<
    WebhooksEventFromKoyweReceivedResponse,
    WebhooksEventFromKoyweReceivedError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/webhooks/koywe",
  });
};

/**
 * Event From Bridge Received
 */
export const webhooksEventFromBridgeReceived = <
  ThrowOnError extends boolean = false,
>(
  options?: Options<unknown, ThrowOnError>,
) => {
  return (options?.client ?? client).post<
    WebhooksEventFromBridgeReceivedResponse,
    WebhooksEventFromBridgeReceivedError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/webhooks/bridge",
  });
};

/**
 * Kyc Event From Aiprise
 */
export const webhooksKycEventFromAiprise = <
  ThrowOnError extends boolean = false,
>(
  options?: Options<unknown, ThrowOnError>,
) => {
  return (options?.client ?? client).post<
    WebhooksKycEventFromAipriseResponse,
    WebhooksKycEventFromAipriseError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/webhooks/aiprise/kyc",
  });
};

/**
 * Events From Aiprise
 */
export const webhooksEventsFromAiprise = <ThrowOnError extends boolean = false>(
  options?: Options<unknown, ThrowOnError>,
) => {
  return (options?.client ?? client).post<
    WebhooksEventsFromAipriseResponse,
    WebhooksEventsFromAipriseError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/webhooks/aiprise/events",
  });
};

/**
 * Get Countries
 */
export const countriesGetCountries = <ThrowOnError extends boolean = false>(
  options?: Options<unknown, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    CountriesGetCountriesResponse,
    CountriesGetCountriesError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/countries/",
  });
};

/**
 * Me
 * Get current user.
 */
export const usersMe = <ThrowOnError extends boolean = false>(
  options?: Options<unknown, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    UsersMeResponse,
    UsersMeError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/users/me",
  });
};

/**
 * My Balance
 * Get user's balance and portfolio value
 */
export const usersMyBalance = <ThrowOnError extends boolean = false>(
  options?: Options<unknown, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    UsersMyBalanceResponse,
    UsersMyBalanceError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/users/me/balance",
  });
};

/**
 * My Assets
 * Get user's positions
 */
export const usersMyAssets = <ThrowOnError extends boolean = false>(
  options?: Options<unknown, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    UsersMyAssetsResponse,
    UsersMyAssetsError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/users/my_assets",
  });
};

/**
 * My Asset By Id
 */
export const usersMyAssetById = <ThrowOnError extends boolean = false>(
  options: Options<UsersMyAssetByIdData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    UsersMyAssetByIdResponse,
    UsersMyAssetByIdError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/users/my_assets/{asset_id}",
  });
};

/**
 * Get Kyc Status
 * Get user's onboarding and KYC status
 */
export const usersGetKycStatus = <ThrowOnError extends boolean = false>(
  options?: Options<unknown, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    UsersGetKycStatusResponse,
    UsersGetKycStatusError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/users/me/kyc-status",
  });
};

/**
 * Get Assets
 */
export const assetsGetAssets = <ThrowOnError extends boolean = false>(
  options?: Options<AssetsGetAssetsData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    AssetsGetAssetsResponse,
    AssetsGetAssetsError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/assets/",
  });
};

/**
 * Get Market Hours
 */
export const assetsGetMarketHours = <ThrowOnError extends boolean = false>(
  options?: Options<unknown, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    AssetsGetMarketHoursResponse,
    AssetsGetMarketHoursError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/assets/market_hours",
  });
};

/**
 * Get Asset Ticks
 */
export const assetsGetAssetTicks = <ThrowOnError extends boolean = false>(
  options: Options<AssetsGetAssetTicksData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    AssetsGetAssetTicksResponse,
    AssetsGetAssetTicksError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/assets/{asset_id}/ticks",
  });
};

/**
 * Get Asset Detail
 */
export const assetsGetAssetDetail = <ThrowOnError extends boolean = false>(
  options: Options<AssetsGetAssetDetailData, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    AssetsGetAssetDetailResponse,
    AssetsGetAssetDetailError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/assets/{asset_id}",
  });
};

/**
 * Get Orders
 */
export const ordersGetOrders = <ThrowOnError extends boolean = false>(
  options?: Options<unknown, ThrowOnError>,
) => {
  return (options?.client ?? client).get<
    OrdersGetOrdersResponse,
    OrdersGetOrdersError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/orders/",
  });
};

/**
 * Create Quote Order
 */
export const ordersCreateQuoteOrder = <ThrowOnError extends boolean = false>(
  options: Options<OrdersCreateQuoteOrderData, ThrowOnError>,
) => {
  return (options?.client ?? client).post<
    OrdersCreateQuoteOrderResponse,
    OrdersCreateQuoteOrderError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/orders/quote",
  });
};

/**
 * Onboarding Names Step
 */
export const onboardingOnboardingNamesStep = <
  ThrowOnError extends boolean = false,
>(
  options: Options<OnboardingOnboardingNamesStepData, ThrowOnError>,
) => {
  return (options?.client ?? client).post<
    OnboardingOnboardingNamesStepResponse,
    OnboardingOnboardingNamesStepError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/onboarding/names-step",
  });
};

/**
 * Onboarding Country Step
 */
export const onboardingOnboardingCountryStep = <
  ThrowOnError extends boolean = false,
>(
  options: Options<OnboardingOnboardingCountryStepData, ThrowOnError>,
) => {
  return (options?.client ?? client).post<
    OnboardingOnboardingCountryStepResponse,
    OnboardingOnboardingCountryStepError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/onboarding/country-step",
  });
};

/**
 * Onboarding Address Step
 */
export const onboardingOnboardingAddressStep = <
  ThrowOnError extends boolean = false,
>(
  options: Options<OnboardingOnboardingAddressStepData, ThrowOnError>,
) => {
  return (options?.client ?? client).post<
    OnboardingOnboardingAddressStepResponse,
    OnboardingOnboardingAddressStepError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/onboarding/address-step",
  });
};

/**
 * Onboarding Kyc Step
 */
export const onboardingOnboardingKycStep = <
  ThrowOnError extends boolean = false,
>(
  options?: Options<unknown, ThrowOnError>,
) => {
  return (options?.client ?? client).post<
    OnboardingOnboardingKycStepResponse,
    OnboardingOnboardingKycStepError,
    ThrowOnError
  >({
    ...options,
    url: "/v0/onboarding/kyc-step",
  });
};

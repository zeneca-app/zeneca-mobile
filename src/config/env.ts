import { z } from "zod";

// Define the schema for environment variables
const envSchema = z.object({
  // Environment
  ENVIRONMENT: z.string(),

  // API & Services
  API_URL: z.string(),

  // Authentication
  PRIVY_APP_ID: z.string(),
  PRIVY_CLIENT_ID: z.string(),

  // Analytics & Monitoring
  SENTRY_DSN: z.string(),
  POSTHOG_API_KEY: z.string(),
  POSTHOG_HOST: z.string(),

  // Blockchain
  RPC_SEPOLIA_URL: z.string(),
  RPC_BASE_URL: z.string(),
  PAYMASTER_SEPOLIA_URL: z.string(),
  PAYMASTER_BASE_URL: z.string(),

  // KYC
  AIPRISE_TEMPLATE_ID: z.string(),
  AI_PRISE_MODE: z.union([z.literal("SANDBOX"), z.literal("PRODUCTION")]),

  // Release Channel
  RELEASE_CHANNEL: z.string().optional(),
});

// Parse and validate environment variables
const env = envSchema.parse({
  // Environment
  ENVIRONMENT: process.env.EXPO_PUBLIC_ENVIRONMENT,

  // API & Services
  API_URL: process.env.EXPO_PUBLIC_API_URL,

  // Authentication and wallets
  PRIVY_APP_ID: process.env.EXPO_PUBLIC_PRIVY_APP_ID,
  PRIVY_CLIENT_ID: process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID,

  // Analytics & Monitoring
  SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
  POSTHOG_API_KEY: process.env.EXPO_PUBLIC_POSTHOG_API_KEY,
  POSTHOG_HOST: process.env.EXPO_PUBLIC_POSTHOG_HOST,

  // Blockchain
  RPC_SEPOLIA_URL: process.env.EXPO_PUBLIC_RPC_SEPOLIA_URL,
  RPC_BASE_URL: process.env.EXPO_PUBLIC_RPC_BASE_URL,
  PAYMASTER_SEPOLIA_URL: process.env.EXPO_PUBLIC_PAYMASTER_SEPOLIA_URL,
  PAYMASTER_BASE_URL: process.env.EXPO_PUBLIC_PAYMASTER_BASE_URL,

  // KYC
  AIPRISE_TEMPLATE_ID: process.env.EXPO_PUBLIC_AIPRISE_TEMPLATE_ID,
  AI_PRISE_MODE: process.env.EXPO_PUBLIC_AI_PRISE_MODE,

  // Release Channel
  RELEASE_CHANNEL: process.env.EXPO_PUBLIC_RELEASE_CHANNEL,
});

export default env;

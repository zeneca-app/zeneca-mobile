import env from "@/config/env";
import { base, sepolia } from "viem/chains";

export const ENV = {
  staging: {
    RPC: env.RPC_SEPOLIA_URL,
    PAYMASTER: env.PAYMASTER_SEPOLIA_URL,
    BLOCKCHAIN_ENVIRONMENT: "testnet",
    CHAIN: sepolia,
    AI_PRISE_MODE: "SANDBOX",
    AIPRISE_TEMPLATE_ID: env.AIPRISE_TEMPLATE_ID,
  },
  production: {
    RPC: env.RPC_BASE_URL,
    PAYMASTER: env.PAYMASTER_BASE_URL,
    BLOCKCHAIN_ENVIRONMENT: "mainnet",
    CHAIN: base,
    AI_PRISE_MODE: "PRODUCTION",
    AIPRISE_TEMPLATE_ID: env.AIPRISE_TEMPLATE_ID,
  },
} as const;

export const currentEnv = ENV[env.ENVIRONMENT as keyof typeof ENV];

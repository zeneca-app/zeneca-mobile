import { Chain } from "viem";

export const transportUrl = (chain: Chain) =>
  `https://api.pimlico.io/v2/${chain.id}/rpc?apikey=${process.env.EXPO_PUBLIC_PIMLICO_API_KEY}`;

export const RPC_BASE_SEPOLIA_URL = "https://rpc.ankr.com/base_sepolia";
export const RPC_SEPOLIA_URL =
  "https://eth-sepolia.g.alchemy.com/v2/b9I66i0I3RI4gVU3oaO8N1Vs2KNgzjry";

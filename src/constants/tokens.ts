import { base, baseSepolia, sepolia } from "viem/chains";

export interface Tokens {
  [token: string]: {
    [chainId: number]: string;
  };
}
const tokens: Tokens = {
  USDC: {
    [sepolia.id]: "0x709CE4CB4b6c2A03a4f938bA8D198910E44c11ff",
    [baseSepolia.id]: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
    [base.id]: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
  },
  ORDER_PROCESSOR_ADDRESS: {
    [sepolia.id]: "0xd0d00Ee8457d79C12B4D7429F59e896F11364247",
    [base.id]: "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD",
  },
};

export default tokens;

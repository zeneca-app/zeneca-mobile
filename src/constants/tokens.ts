import { base, sepolia } from "viem/chains";

export interface Tokens {
  [token: string]: {
    [chainId: number]: string;
  };
}
const tokens: Tokens = {
  USDC: {
    [sepolia.id]: "0x709CE4CB4b6c2A03a4f938bA8D198910E44c11ff",
    [base.id]: "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913",
  },
  ORDER_PROCESSOR_ADDRESS: {
    [sepolia.id]: "0xd0d00Ee8457d79C12B4D7429F59e896F11364247",
    [base.id]: "0x63FF43009f9ba3584aF2Ddfc3D5FE2cb8AE539c0",
  },
};

export default tokens;

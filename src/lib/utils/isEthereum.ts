import { mainnet, sepolia } from "viem/chains";

export type isEthereumOptions = {
  chainId: number;
  isMainnetOnly?: boolean; // If the chainId check is only allowed on mainnet
};
/**
 * isEthereum
 *  - Checks if the chain is mainnet or sepolia
 */
export function isEthereum({
  chainId,
  isMainnetOnly = false,
}: isEthereumOptions): boolean {
  // If only ETH mainnet
  if (isMainnetOnly && chainId === mainnet.id) {
    return true;
  }
  // If only ETH or ETH Sepolia
  if (!isMainnetOnly && (chainId === sepolia.id || chainId === mainnet.id)) {
    return true;
  }
  return false;
}

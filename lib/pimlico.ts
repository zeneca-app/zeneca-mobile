import { currentEnv } from "@/config/by_stage";
import tokens from "@/constants/tokens";
import { getWalletClient } from "@/lib/smart-accounts";
import { EmbeddedWalletState } from "@privy-io/expo";
import {
  createSmartAccountClient,
  walletClientToSmartAccountSigner,
} from "permissionless";
import {
  signerToSafeSmartAccount,
  signerToSimpleSmartAccount,
} from "permissionless/accounts";
import {
  createPimlicoBundlerClient,
  createPimlicoPaymasterClient,
} from "permissionless/clients/pimlico";
import {
  Address,
  Chain,
  createPublicClient,
  encodeFunctionData,
  erc20Abi,
  http,
} from "viem";
import { entryPoint07Address } from "viem/account-abstraction";

export function getChainPublicClient(chain: Chain) {
  return createPublicClient({
    chain: chain,
    transport: http(),
  });
}

export const publicClient = createPublicClient({
  transport: http(currentEnv.RPC),
});

export const paymasterClient = () =>
  createPimlicoPaymasterClient({
    transport: http(currentEnv.PAYMASTER),
    entryPoint: entryPoint07Address,
  });

export const pimlicoBundlerClient = () =>
  createPimlicoBundlerClient({
    transport: http(currentEnv.PAYMASTER),
    entryPoint: entryPoint07Address,
  });

export const getPimlicoSmartAccountClient = async (
  address: `0x${string}`,
  chain: Chain,
  wallet: EmbeddedWalletState,
) => {
  const walletClient = getWalletClient(address, chain, wallet);
  const signer = walletClientToSmartAccountSigner(walletClient);
  const simpleAccount = await signerToSimpleSmartAccount(publicClient, {
    entryPoint: entryPoint07Address,
    signer: signer,
    factoryAddress: "0x91E60e0613810449d098b0b5Ec8b51A0FE8c8985",
  });
  return createSmartAccountClient({
    // @ts-ignore
    account: simpleAccount,
    entryPoint: entryPoint07Address,
    chain: currentEnv.CHAIN,
    bundlerTransport: http(currentEnv.PAYMASTER),
    middleware: {
      gasPrice: async () =>
        (await pimlicoBundlerClient().getUserOperationGasPrice()).fast,
      sponsorUserOperation: paymasterClient().sponsorUserOperation,
    },
  });
};

export const transferUSDC = async (
  smartAccountClient: any,
  amount: number,
  chain: Chain,
  toAddress: string,
) => {
  if (!smartAccountClient) {
    throw new Error("Smart account client not found");
  }
  const USDC_ADDRESS = tokens.USDC[chain.id] as Address;
  const tx = await smartAccountClient?.sendTransaction({
    to: USDC_ADDRESS,
    value: BigInt(0),
    data: encodeFunctionData({
      abi: erc20Abi,
      functionName: "transfer",
      args: [toAddress as Address, BigInt(amount * 10 ** 6)],
    }),
  });
  return tx;
};

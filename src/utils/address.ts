import { isAddress } from "viem";

export const shortenAddress = (address: string) => {
  if (!address || !isAddress(address)) return "";
  return `${address.slice(0, 6)}····${address.slice(-4)}`;
};

export const shortenAddressLonger = (address: string) => {
  if (!address || !isAddress(address)) return "";
  return `${address.slice(0, 8)}···${address.slice(-8)}`;
};

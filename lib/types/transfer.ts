import { Basename } from "@/types/basenames";
import { Address } from "viem";

export type TransferCrypto = {
  name?: string | Basename;
  address: Address;
  amount: number;
  fee?: string;
  from_address: Address;
  to_address: Address;
};

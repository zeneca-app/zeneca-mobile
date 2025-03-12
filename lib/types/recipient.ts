import { Basename } from "@/types/basenames";
import { Address } from "viem";

export type RecipientCrypto = {
  name?: string | Basename;
  address: Address;
};

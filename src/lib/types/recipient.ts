import { Address } from "viem";
import { Basename } from "@/types/basenames";

export type RecipientCrypto = {
  name?: string | Basename;
  address: Address;
};

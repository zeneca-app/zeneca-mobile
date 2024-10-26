import { UserRead } from "@/client";

export type DBUser = UserRead & {
  token: string;
};

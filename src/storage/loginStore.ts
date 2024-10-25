import { LoginStatus } from "@/lib/types/login";
import { create } from "zustand";

type LoginStore = {
  email: string;
  setEmail: (email: string) => void;
  loginStatus: LoginStatus;
  setLoginStatus: (loginStatus: LoginStatus) => void;
};

export const useLoginStore = create<LoginStore>((set, get) => ({
  email: "",
  setEmail: (email) => set({ email }),
  loginStatus: LoginStatus.INITIAL,
  setLoginStatus: (loginStatus) => set({ loginStatus }),
}));

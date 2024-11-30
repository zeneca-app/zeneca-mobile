import { UserRead } from "@/client";
import { create } from "zustand";

type UserStore = {
  user?: UserRead;
  setUser: (user?: UserRead) => void;
  resetUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
  resetUser: () => set({ user: undefined }),
}));

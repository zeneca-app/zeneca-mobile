import { DBUser } from "@/storage/interfaces";
import { create } from "zustand";

type UserStore = {
  user?: DBUser;
  setUser: (user?: DBUser) => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: undefined,
  setUser: (user) => set({ user }),
}));

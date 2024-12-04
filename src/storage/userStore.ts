import { DBUser } from "@/storage/interfaces";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import zustandStorage from "./storage";

type UserStore = {
  user?: DBUser;
  setUser: (user?: DBUser) => void;
  resetUser: () => void;
};

const initialState = {
  user: undefined,
};

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        user: initialState.user,
        setUser: (data: DBUser | undefined) => set(() => ({ user: data })),
        resetUser: () => set({ user: undefined }),
      }),
      {
        name: "user-storage",
        storage: createJSONStorage(() => zustandStorage),
      },
    ),
  ),
);

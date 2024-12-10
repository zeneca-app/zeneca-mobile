import { usersMeOptions } from "@/client/@tanstack/react-query.gen";
import { DBUser } from "@/storage/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import zustandStorage from "./storage";

const queryClient = new QueryClient();

type UserStore = {
  user?: DBUser;
  isLoading: boolean;
  setUser: (user?: DBUser) => void;
  resetUser: () => void;
  fetchUser: () => Promise<DBUser | undefined>;
};

const initialState = {
  user: undefined,
  isLoading: false,
};

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set, get) => ({
        user: initialState.user,
        isLoading: initialState.isLoading,
        setUser: (data: DBUser | undefined) => set(() => ({ user: data })),
        resetUser: () => set({ user: undefined }),
        fetchUser: async () => {
          // Skip if already fetching
          if (get().isLoading) {
            return get().user;
          }
          console.log("fetching user");
          set({ isLoading: true });
          try {
            const userData =
              await queryClient.ensureQueryData(usersMeOptions());
            set({ user: userData, isLoading: false });
            return userData;
          } catch (error) {
            console.error("Error fetching user:", error);
            set({ isLoading: false });
            return undefined;
          }
        },
      }),
      {
        name: "user-storage",
        storage: createJSONStorage(() => zustandStorage),
      },
    ),
  ),
);

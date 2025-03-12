import { usersMeOptions } from "@/client/@tanstack/react-query.gen";
import { DBUser } from "@/storage/interfaces";
import zustandStorage from "@/storage/storage";
import { QueryClient } from "@tanstack/react-query";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";

type UserState = {
  user?: DBUser;
  isLoading: boolean;
  error?: Error;
};

type UserActions = {
  setUser: (user?: DBUser) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error?: Error) => void;
  resetUser: () => void;
  fetchUser: () => Promise<DBUser | undefined>;
};

type UserStore = UserState & UserActions;

const initialState: UserState = {
  user: undefined,
  isLoading: false,
  error: undefined,
};

export const createUserStore = (queryClient: QueryClient) =>
  create<UserStore>()(
    devtools(
      persist(
        (set, get) => ({
          ...initialState,
          setUser: (user) => set({ user }),
          setLoading: (isLoading) => set({ isLoading }),
          setError: (error) => set({ error }),
          resetUser: () => set(initialState),
          fetchUser: async () => {
            if (get().isLoading) return get().user;

            set({ isLoading: true, error: undefined });

            try {
              const userData =
                await queryClient.ensureQueryData(usersMeOptions());
              set({ user: userData, isLoading: false });
              return userData;
            } catch (error) {
              const err =
                error instanceof Error ? error : new Error("Unknown error");
              set({ error: err, isLoading: false });
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

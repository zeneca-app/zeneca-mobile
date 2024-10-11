import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import zustandStorage from "./storage";

interface AuthState {
  logged: boolean;
  updateLogged: (status: boolean) => void;
  reset: () => void;
  email: string;
  updateEmail: (email: string) => void;
  methodId: string;
  updateMethodId: (methodId: string) => void;
}

const initialState = {
  logged: false,
  email: "",
  methodId: "",
};

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        logged: false,
        email: "",
        methodId: "",
        updateLogged: (status) => set(() => ({ logged: status })),
        updateEmail: (email) => set(() => ({ email: email })),
        updateMethodId: (methodId) => set(() => ({ methodId: methodId })),
        reset: () => set(() => ({ logged: initialState.logged })),
      }),
      {
        name: "auth-storage", // name of the item in the storage (must be unique)
        storage: createJSONStorage(() => zustandStorage),
      },
    ),
  ),
);

export default useAuthStore;

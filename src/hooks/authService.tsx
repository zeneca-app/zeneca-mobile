import LogoAnimation from "@/components/IntroAnimation";
import { useUserStore } from "@/storage";
import { usePrivy } from "@privy-io/expo";
import { ReactNode, useEffect, useState } from "react";

export function AuthService({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState<boolean>(false);
  const { isReady: isPrivyReady, user: privyUser } = usePrivy();

  const { user, setUser } = useUserStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));

  useEffect(() => {
    if (!isPrivyReady) return;

    // Not authenticated if no privyUser
    if (!privyUser) {
      setUser(undefined);
      setIsReady(true);
      return;
    }

    // Already authenticated if both exist
    if (privyUser) {
      setIsReady(true);
      return;
    }
  }, [isPrivyReady, privyUser]);

  // Only render children when ready and both auth states exist
  if (isReady) {
    return <>{children}</>;
  }

  return <LogoAnimation />;
}

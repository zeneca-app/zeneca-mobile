import { usersMe } from "@/client";
import { useUserStore } from "@/storage";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSegments } from "expo-router";

export const useAuthRedirect = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const { setUser, user } = useUserStore((state) => ({
    setUser: state.setUser,
    user: state.user,
  }));

  const inAuthGroup = segments[0] === "(authenticated)";

  const { isLoading } = useQuery({
    queryKey: ["user", isSignedIn],
    queryFn: async () => {
      if (!isSignedIn) return null;
      const token = await getToken();
      if (!token) throw new Error("No authentication token available");
      const response = await usersMe({
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response?.data) {
        setUser(response.data);
        router.replace("/(authenticated)/modals/lock");
      }
      return response;
    },
    retry: false,
    enabled: isLoaded && isSignedIn && !inAuthGroup,
  });

  // Handle unauthenticated access to protected routes
  if (!isSignedIn && inAuthGroup) {
    router.replace("/");
  }

  return {
    isLoaded,
    isSignedIn,
    isLoading,
  };
};

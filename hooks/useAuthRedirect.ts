import { usersMe } from "@/client";
import { useUserStore } from "@/storage";
import { useAuth } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

export const useAuthRedirect = () => {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  const { setUser, user } = useUserStore((state) => ({
    setUser: state.setUser,
    user: state.user,
  }));

  const inAuthGroup = segments[0] === "(main)";
  const inPublicGroup = segments[0] === undefined || segments[0] === "(public)";

  // Immediate redirect for authenticated users on public routes
  useEffect(() => {
    if (isLoaded && isSignedIn && inPublicGroup) {
      router.replace("/(modals)/lock");
    }
  }, [isLoaded, isSignedIn, inPublicGroup]);

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
        // Only redirect if not already on lock screen
        if (!segments.includes("lock")) {
          router.replace("/(modals)/lock");
        }
      }
      return response;
    },
    retry: false,
    enabled: isLoaded && isSignedIn,
  });

  // Handle unauthenticated access to protected routes
  useEffect(() => {
    if (isLoaded && !isSignedIn && inAuthGroup) {
      router.replace("/");
    }
  }, [isLoaded, isSignedIn, inAuthGroup]);

  return {
    isLoaded,
    isSignedIn,
    isLoading,
  };
};

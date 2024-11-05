import { client } from "@/client/services.gen";
import { usePrivy } from "@privy-io/expo";
import { useEffect } from "react";

export const useAuthInterceptor = () => {
  const { getAccessToken } = usePrivy();

  useEffect(() => {
    const interceptor = client.interceptors.request.use(async (request) => {
      try {
        const token = await getAccessToken();
        request.headers.set("Authorization", `Bearer ${token}`);
      } catch (error) {
        console.error("Error getting access token:", error);
      }
      return request;
    });

    // Cleanup function to remove the interceptor when component unmounts
    return () => {
      client.interceptors.request.eject(interceptor as any);
    };
  }, [getAccessToken]);
};

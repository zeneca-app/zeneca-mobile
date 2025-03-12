import env from "@/config/env";
import { createPrivyClient } from "@privy-io/expo";
import { client } from "./services.gen";

const APP_ID = env.PRIVY_APP_ID;
const CLIENT_ID = env.PRIVY_CLIENT_ID;

const privy = createPrivyClient({
  appId: APP_ID,
  clientId: CLIENT_ID,
});

let token: string | null = null;

client.interceptors.request.use(async (request, options) => {
  try {
    token = await privy.getAccessToken();
    
    console.log("[API Client] Request interceptor - Token obtained", token ? "Token exists" : "No token");
    console.log("token", token)
    console.log("[API Client] Request URL:", request.url);
    
    if (token) {
      request.headers.set("Authorization", "Bearer " + token);
    } else {
      console.warn("[API Client] No token available for request to", request.url);
    }
    
    return request;
  } catch (error) {
    console.error("[API Client] Error in request interceptor", error);
    return request;
  }
});

client.interceptors.response.use((response, request, options) => {
  console.log("[API Client] Response interceptor - Status:", response.status, "URL:", request.url);
  
  if (response.status === 403) {
    console.error("[API Client] Forbidden response from API", request.url);
  }
  
  if (response.status >= 400) {
    console.error("[API Client] Error response from API", {
      status: response.status,
      url: request.url,
      response: response
    });
  }
  
  return response;
});

export default client;

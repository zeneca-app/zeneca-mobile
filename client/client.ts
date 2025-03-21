import clerkInstance from "@/utils/clerk";
import { client } from "./services.gen";

client.interceptors.request.use(async (request, options) => {
  const token = await clerkInstance.session?.getToken();

  console.log("Checking token...", token);
  console.log("[API Client] Request URL:", request.url);

  request.headers.set("Authorization", "Bearer " + token);
  return request;
});

client.interceptors.response.use((response, request, options) => {
  if (!response.ok) {
    console.error("[API Client] Response error:", {
      status: response.status,
      statusText: response.statusText,
      url: request.url
    });
  }
  if (response.status === 403) {
    console.error("[API Client] Forbidden response from API", request.url);
  }
  return response;
});

export default client;

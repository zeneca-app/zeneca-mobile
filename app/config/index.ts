import { client } from "@/client/services.gen";
import env from "@/config/env";

// Configure API client
client.setConfig({
  baseUrl: env.API_URL,
});

// Export configuration for use in other files
export { client, env }; 
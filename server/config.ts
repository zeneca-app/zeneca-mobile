import { client } from "@/client/services.gen";
import env from "@/config/env";

client.setConfig({
  baseUrl: env.API_URL,
});

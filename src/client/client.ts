import { createPrivyClient } from "@privy-io/expo";
import { client } from "./services.gen";

const APP_ID = process.env.EXPO_PUBLIC_PRIVY_APP_ID!;
const CLIENT_ID = process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID!;

const privy = createPrivyClient({
  appId: APP_ID,
  clientId: CLIENT_ID,
});

let token: string | null = null;

client.interceptors.request.use(async (request, options) => {
  token = await privy.getAccessToken();
  //console.log("URL", request.url);
  //console.log("TOKEN", token);
  request.headers.set("Authorization", "Bearer " + token);
  return request;
});

client.interceptors.response.use((response, request, options) => {
  if (response.status === 403) {
    console.log("Forbidden");
  }
  return response;
});

export default client;

import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  client: "@hey-api/client-fetch",
  input: "https://sandbox.zeneca.app/v0/openapi.json",
  output: {
    format: "prettier",
    path: "src/client",
  },

  // Additional configuration options can be added here
  // For example:
  // headers: {
  //   'Content-Type': 'application/json',
  // },
  
  plugins: [
    // ...other plugins
    "@tanstack/react-query",
   
  ],
});

import env from "@/config/env";
import { getClerkInstance } from "@clerk/clerk-expo";

const clerkInstance = getClerkInstance({
  publishableKey: env.CLERK_PUBLISHABLE_KEY,
});

export default clerkInstance;

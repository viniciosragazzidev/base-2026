import { createAuthClient } from "better-auth/client";

export const authClient = createAuthClient({
  baseURL: "http://localhost:3333",
});

export const { signIn, signUp, signOut, useSession } = authClient;

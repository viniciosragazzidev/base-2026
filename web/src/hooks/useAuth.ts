import { useState, useEffect } from "react";
import { authClient } from "../lib/auth-client";

// Using any to avoid type conflicts with Better Auth response
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SessionData = any;

export interface AuthState {
  session: SessionData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load session on mount
  useEffect(() => {
    const loadSession = async () => {
      try {
        const sessionData = await authClient.getSession();
        if (sessionData?.data) {
          setSession(sessionData.data);
        }
      } catch (error) {
        console.error("Error loading session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result?.data) {
        setSession(result.data);
        return { success: true, data: result.data };
      }
      return { success: false, error: "Authentication failed" };
    } catch (error: any) {
      console.error("Sign in error:", error);
      return {
        success: false,
        error: error?.message || "Authentication failed",
      };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const result = await authClient.signUp.email({
        email,
        password,
        name,
      });

      if (result?.data) {
        setSession(result.data);
        return { success: true, data: result.data };
      }
      return { success: false, error: "Registration failed" };
    } catch (error: any) {
      console.error("Sign up error:", error);
      return { success: false, error: error?.message || "Registration failed" };
    }
  };

  const signOut = async () => {
    try {
      await authClient.signOut();
      window.location.href = "/";
      setSession(null);
      return { success: true };
    } catch (error: any) {
      console.error("Sign out error:", error);
      return { success: false, error: error?.message || "Sign out failed" };
    }
  };

  return {
    session,
    isLoading,
    isAuthenticated: !!session,
    signIn,
    signUp,
    signOut,
  };
};

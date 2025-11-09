import { useQuery } from "@tanstack/react-query";
import type { UserWithClaimedBusinesses } from "@shared/schema";
import { isUnauthorizedError } from "@/lib/authUtils";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery<UserWithClaimedBusinesses | null>({
    queryKey: ["/api/auth/user"],
    retry: false,
    queryFn: async ({ signal }) => {
      try {
        const response = await fetch("/api/auth/user", { signal });
        
        // Treat 401 as "not authenticated" rather than an error
        if (response.status === 401) {
          return null;
        }
        
        if (!response.ok) {
          throw new Error(`${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        // Network errors or other issues should be treated as errors
        if (error instanceof Error && error.name !== 'AbortError') {
          throw error;
        }
        return null;
      }
    },
  });

  return {
    user: user || null,
    isLoading,
    isAuthenticated: !!user,
    error: error && !isUnauthorizedError(error as Error) ? error : null,
  };
}

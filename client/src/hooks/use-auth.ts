import { useQuery, useMutation } from "@tanstack/react-query";
import { getQueryFn, apiRequest, queryClient, setStoredToken, clearStoredToken } from "@/lib/queryClient";
import { useLocation } from "wouter";

interface AuthUser {
  username: string;
}

interface AuthResponse {
  user: AuthUser;
}

interface LoginResponse {
  user: AuthUser;
  token: string;
}

export function useAuth() {
  const { data, isLoading } = useQuery<AuthResponse | null>({
    queryKey: ["/api/auth/me"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    staleTime: Infinity,
    retry: false,
  });

  return {
    user: data?.user ?? null,
    isLoading,
    isAuthenticated: !!data?.user,
  };
}

export function useLogin() {
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const res = await apiRequest("POST", "/api/auth/login", credentials);
      return (await res.json()) as LoginResponse;
    },
    onSuccess: (data) => {
      setStoredToken(data.token);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setLocation("/");
    },
  });
}

export function useLogout() {
  const [, setLocation] = useLocation();

  return useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/auth/logout");
    },
    onSuccess: () => {
      clearStoredToken();
      queryClient.clear();
      setLocation("/login");
    },
  });
}

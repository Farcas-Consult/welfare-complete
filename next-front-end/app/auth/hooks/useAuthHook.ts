"use client";

import * as React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authService } from "../services/authService";
import { LoginDto, RegisterDto, AuthResponse } from "../types/auth-types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { store } from "@/store/store";
import {
  setLoading,
  setTokens,
  setUserProfile,
  setError,
  logout,
} from "@/store/slices/authSlice";
import { getDashboardUrl } from "@/lib/utils/navigation";

export function useLogin() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: LoginDto) => {
      dispatch(setLoading());
      const response = await authService.login(data);
      return response;
    },
    onSuccess: async (response) => {
      // API response structure: { statusCode, message, data: { accessToken, refreshToken, user } }
      // postData returns response.data, so response = { statusCode, message, data: { accessToken, refreshToken, user } }
      const responseData = (
        response as unknown as {
          statusCode?: number;
          message?: string;
          data?: AuthResponse;
        }
      ).data;

      if (!responseData) {
        throw new Error("Invalid response from server");
      }

      const { accessToken, refreshToken, user } = responseData;

      if (!accessToken || !refreshToken) {
        throw new Error("Invalid response from server");
      }

      // Set tokens first
      dispatch(setTokens({ accessToken, refreshToken }));

      // Only set user profile if user data is available
      if (user) {
        const userRole = (user.role || "member") as
          | "member"
          | "treasurer"
          | "secretary"
          | "committee"
          | "admin"
          | "auditor";

        dispatch(
          setUserProfile({
            id: user.id || "",
            email: user.email || "",
            role: userRole,
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            memberNo: user.memberNo || "",
          })
        );

        // Wait for Redux state to be persisted before redirecting
        await new Promise<void>((resolve) => {
          const checkAuth = () => {
            const state = store.getState();
            const isAuth = state.auth.isAuthenticated && state.auth.accessToken;

            // Check if redux-persist has saved to localStorage
            const persistedAuth = localStorage.getItem("persist:auth");
            const hasPersisted =
              persistedAuth && persistedAuth.includes("accessToken");

            if (isAuth && hasPersisted) {
              resolve();
            } else {
              // Wait a bit more for redux-persist to finish
              setTimeout(checkAuth, 50);
            }
          };

          // Start checking after a small delay to let Redux update
          setTimeout(checkAuth, 100);
        });

        toast.success("Login successful!");

        // Redirect to role-specific dashboard
        const dashboardUrl = getDashboardUrl(userRole);
        router.replace(dashboardUrl);
      } else {
        // Fallback to default dashboard if no user data
        router.replace("/dashboard");
      }
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as Error).message ||
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message ||
        "Login failed. Please try again.";
      dispatch(setError(errorMessage));
      // Don't show toast, let the component handle error display
    },
  });
}

export function useRegister() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: async (data: RegisterDto) => {
      dispatch(setLoading());
      const response = await authService.register(data);
      return response;
    },
    onSuccess: (response) => {
      // API response structure: { statusCode, message, data: { ... } }
      const responseWrapper = response as unknown as {
        statusCode?: number;
        message?: string;
        data?: { id?: string; username?: string; email?: string };
      };

      const responseData = responseWrapper.data;

      if (responseData && (responseData.id || responseData.username)) {
        toast.success("Registration successful! Please login to continue.");
        router.push("/auth/login");
        return;
      }

      throw new Error("Registration failed - invalid response from server");
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as Error).message ||
        (error as { response?: { data?: { message?: string } } }).response?.data
          ?.message ||
        "Registration failed. Please try again.";
      dispatch(setError(errorMessage));
      toast.error(errorMessage);
    },
  });
}

export function useGetProfile() {
  const dispatch = useAppDispatch();
  const { accessToken, user } = useAppSelector((state) => state.auth);

  const queryResult = useQuery({
    queryKey: ["auth-profile"],
    queryFn: async () => {
      const response = await authService.getProfile();
      return response;
    },
    enabled: !!accessToken && !user,
    retry: false,
  });

  // Handle success with useEffect since onSuccess is deprecated
  React.useEffect(() => {
    if (queryResult.data) {
      const response = queryResult.data;
      // API response structure: { statusCode, message, data: { user } }
      const userData = (
        response as unknown as {
          statusCode?: number;
          message?: string;
          data?: AuthResponse["user"];
        }
      ).data;

      if (userData) {
        dispatch(
          setUserProfile({
            id: userData.id || "",
            email: userData.email || "",
            role: (userData.role || "member") as
              | "member"
              | "treasurer"
              | "secretary"
              | "committee"
              | "admin"
              | "auditor",
            firstName: userData.firstName || "",
            lastName: userData.lastName || "",
            memberNo: userData.memberNo || "",
          })
        );
      }
    }
  }, [queryResult.data, dispatch]);

  // Handle error
  React.useEffect(() => {
    if (queryResult.isError) {
      // Token is invalid, logout
      dispatch(logout());
    }
  }, [queryResult.isError, dispatch]);

  return queryResult;
}

export function useLogout() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  return useMutation({
    mutationFn: async () => {
      await authService.logout();
    },
    onSuccess: () => {
      dispatch(logout());
      router.push("/auth/login");
      toast.success("Logged out successfully");
    },
    onError: () => {
      // Even if logout fails on server, clear local state
      dispatch(logout());
      router.push("/auth/login");
    },
  });
}

export function useCheckUsername(username: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["check-username", username],
    queryFn: async () => {
      const response = await authService.checkUsername(username);
      // Handle both wrapped and unwrapped response structures
      const responseData =
        (
          response as unknown as {
            statusCode?: number;
            message?: string;
            data?: { available: boolean };
          }
        ).data || (response as unknown as { available: boolean });
      return responseData;
    },
    enabled:
      enabled && username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(username),
    retry: false,
    staleTime: 0,
  });
}

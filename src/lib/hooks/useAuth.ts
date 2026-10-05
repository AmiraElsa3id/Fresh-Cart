import { useMutation } from "@tanstack/react-query";
import api from "../api";

export function useSignUp() {
  return useMutation({
    mutationFn: async (formData: {
      name: string;
      email: string;
      password: string;
      rePassword: string;
      phone: string;
    }) => {
      const { data } = await api.post("/auth/signup", formData);
      return data;
    },
  });
}

export function useSignIn() {
  return useMutation({
    mutationFn: async (formData: {
      email: string;
      password: string;
    }) => {
      const { data } = await api.post("/auth/signin", formData);
      return data;
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await api.post("/auth/forgotPasswords", { email });
      return data;
    },
  });
}

export function useVerifyResetCode() {
  return useMutation({
    mutationFn: async (resetCode: string) => {
      const { data } = await api.post("/auth/verifyResetCode", { resetCode });
      return data;
    },
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: async ({ email, newPassword }: { email: string; newPassword: string }) => {
      const { data } = await api.put("/auth/resetPassword", { email, newPassword });
      return data;
    },
  });
}

export function useVerifyToken() {
  return useMutation({
    mutationFn: async (token: string) => {
      const { data } = await api.get("/auth/verifyToken", { headers: { token } });
      return data;
    },
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: async (formData: {
      name: string;
      email: string;
      phone: string;
    }) => {
      const { data } = await api.put("/users/updateMe", formData);
      return data;
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (formData: {
      currentPassword: string;
      password: string;
      rePassword: string;
    }) => {
      const { data } = await api.put("/users/changeMyPassword", formData);
      return data;
    },
  });
}
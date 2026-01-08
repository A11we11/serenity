import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authApi, LoginCredentials, RegisterData } from "../api/auth.api";
import { useAuthStore } from "../../../store/index";

export function useAuth() {
  const navigate = useNavigate();
  const { setAuth, logout: logoutStore } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      navigate("/dashboard");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterData) => authApi.register(data),
    onSuccess: (data) => {
      setAuth(data.user, data.token);
      navigate("/dashboard");
    },
  });

  const logout = () => {
    logoutStore();
    navigate("/login");
  };

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
  };
}

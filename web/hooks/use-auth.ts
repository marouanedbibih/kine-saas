import { authService } from "@/services/auth.services";
import { AuthRequest } from "../types/auth";
import { useState } from "react";
import { jwtService } from "@/services/jwt.services";
import { useRouter } from "next/navigation";
import { alertService } from "@/services/alert.services";

export const useAuthHooks = () => {
  const [loginRequest, setLoginRequest] = useState<AuthRequest>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setIsLoading(true);

    authService
      .login(loginRequest)
      .then((response) => {
        console.log("Connexion réussie", response);
        jwtService.setToken(response.tokens.accessToken);

        const role = response.user.role;
        if (role === "ADMIN") {
          router.push("/");
        } else if (role === "KINESITHERAPEUTE") {
          router.push("/doctor-dashboard");
        }
        else {
            router.push("/auth/login");
        }
        
        alertService.success("Connexion réussie", {
          duration: 4000,
          description: `Bienvenue, ${response.user.email} !`,
        });
      })
      .catch((error) => {
        alertService.error("Échec de la connexion", {
          duration: 4000,
          description: "Veuillez vérifier vos identifiants et réessayer.",
        });
        console.error("Échec de la connexion", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return {
    loginRequest,
    setLoginRequest,
    isLoading,
    handleLogin,
    error,
    setError,
  };
};

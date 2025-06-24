import { AuthRequest } from "../types/auth";
import { useState } from "react";
import { jwtService } from "@/services/jwt.services";
import { useRouter } from "next/navigation";
import { alertService } from "@/services/alert.services";
import { authService } from "@/modules/auth/services/auth.services";
import { LoginResponse } from "@/modules/auth/types/login";

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
      .then((response: LoginResponse) => {
        console.log("Connexion réussie", response);
        jwtService.setToken(response.accessToken);

        const role = jwtService.decodeToken(response.accessToken).role;
        console.log("Rôle de l'utilisateur :", role);
        const email = jwtService.decodeToken(response.accessToken).email;
        if (role === "ADMIN") {
          router.push("/");
        } else if (role === "THERAPIST") {
          router.push("/doctor-dashboard");
        }
        else {
            router.push("/auth/login");
        }
        
        alertService.success("Connexion réussie", {
          duration: 4000,
          description: `Bienvenue, ${email} !`,
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

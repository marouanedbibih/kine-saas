import axiosClient from "@/lib/axios";
import { AuthRequest, AuthResponse } from "@/types/auth";

class AuthService {
  async login(credentials: AuthRequest): Promise<AuthResponse> {
    const response = await axiosClient.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  }
}

export const authService = new AuthService();

import axiosClient from "@/lib/axios";
import { LoginRequest, LoginResponse } from "../types/login";



class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await axiosClient.post<LoginResponse>("/api/v1/login", credentials);
    return response.data;
  }
}

export const authService = new AuthService();

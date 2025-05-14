// services/user.service.ts
import axiosClient from '@/lib/axios';
import { ApiService } from './api.service';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  // Add other user properties
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface LoginResponse {
  user: User;
  tokens: string;
}

class UserService extends ApiService<User> {
  constructor() {
    super('/users');
  }

  async login(credentials: LoginCredentials): Promise<any> {
    const response = await axiosClient.post('/auth/login', credentials);
    return response.data.data;
  }

  async register(data: RegisterData): Promise<LoginResponse> {
    const response = await axiosClient.post('/auth/register', data);
    return response.data.data;
  }

  async getCurrentUser(): Promise<User> {
    const response = await axiosClient.get('/auth/me');
    return response.data.data;
  }

  async logout(): Promise<void> {
    await axiosClient.post('/auth/logout');
  }
}

export const userService = new UserService();
// services/api.service.ts
import axiosClient, { ApiResponse, createApiClient } from '../lib/axios';
import { AxiosRequestConfig } from 'axios';
import { GetServerSidePropsContext } from 'next';

// Generic service for common API operations
export class ApiService<T = any> {
  constructor(private readonly basePath: string) {}

  // Client-side methods
  async getAll(params?: Record<string, any>): Promise<T[]> {
    const response = await axiosClient.get<ApiResponse<T[]>>(this.basePath, { params });
    return response.data.data;
  }

  async getById(id: string | number): Promise<T> {
    const response = await axiosClient.get<ApiResponse<T>>(`${this.basePath}/${id}`);
    return response.data.data;
  }

  async create(data: Partial<T>): Promise<T> {
    const response = await axiosClient.post<ApiResponse<T>>(this.basePath, data);
    return response.data.data;
  }

  async update(id: string | number, data: Partial<T>): Promise<T> {
    const response = await axiosClient.put<ApiResponse<T>>(`${this.basePath}/${id}`, data);
    return response.data.data;
  }

  async delete(id: string | number): Promise<void> {
    await axiosClient.delete(`${this.basePath}/${id}`);
  }

  // Server-side methods (for getServerSideProps)
  static async getFromServer<D = any>(
    url: string, 
    context: GetServerSidePropsContext,
    config?: AxiosRequestConfig
  ): Promise<D> {
    // Create axios instance that reads cookies from the server context
    const serverAxios = createApiClient({
      headers: context.req?.headers.cookie 
        ? { Cookie: context.req.headers.cookie }
        : undefined,
      ...config
    });

    const response = await serverAxios.get<ApiResponse<D>>(url);
    return response.data.data;
  }
}
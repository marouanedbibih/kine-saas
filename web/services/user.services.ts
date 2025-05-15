import axiosClient from '../lib/axios';
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
  QueryUsersDto,
  UserResponseDto,
  PaginatedUsersResponse
} from '../types/user';

export class UserService {
  private readonly baseUrl = '/users';

  /**
   * Creates a new user
   * @param data User creation data
   * @returns Newly created user
   */
  async create(data: CreateUserDto): Promise<UserResponseDto> {
    return axiosClient.post<UserResponseDto>(this.baseUrl, data).then(response => response.data);
  }

  /**
   * Retrieves a paginated list of users with optional filtering
   * @param query Optional query parameters for filtering, pagination, and sorting
   * @returns Paginated list of users
   */
  async getAll(query?: QueryUsersDto): Promise<PaginatedUsersResponse> {
    return axiosClient.get<PaginatedUsersResponse>(this.baseUrl, { params: query }).then(response => response.data);
  }

  /**
   * Retrieves a single user by ID
   * @param id User ID
   * @returns User details
   */
  async getOne(id: string): Promise<UserResponseDto> {
    return axiosClient.get<UserResponseDto>(`${this.baseUrl}/${id}`).then(response => response.data);
  }

  /**
   * Updates an existing user
   * @param id User ID
   * @param data User update data
   * @returns Updated user
   */
  async update(id: string, data: UpdateUserDto): Promise<UserResponseDto> {
    return axiosClient.patch<UserResponseDto>(`${this.baseUrl}/${id}`, data).then(response => response.data);
  }

  /**
   * Removes a user
   * @param id User ID
   * @returns Void
   */
  async remove(id: string): Promise<void> {
    return axiosClient.delete(`${this.baseUrl}/${id}`).then(() => {});
  }

  /**
   * Changes a user's password
   * @param id User ID
   * @param data Password change data containing current and new passwords
   * @returns Updated user
   */
  async changePassword(id: string, data: ChangePasswordDto): Promise<UserResponseDto> {
    return axiosClient.patch<UserResponseDto>(
      `${this.baseUrl}/${id}/change-password`, 
      data
    ).then(response => response.data);
  }

  /**
   * Toggles a user's active status (active/inactive)
   * @param id User ID
   * @returns Updated user with toggled status
   */
  async toggleStatus(id: string): Promise<UserResponseDto> {
    return axiosClient.patch<UserResponseDto>(
      `${this.baseUrl}/${id}/toggle-status`
    ).then(response => response.data);
  }
}

// Create a singleton instance for easy importing
const userService = new UserService();
export default userService;
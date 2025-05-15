// contexts/UserContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import userService from "../services/user.services"; // Adjust import path as needed
import { UserResponseDto, CreateUserDto, UpdateUserDto, ChangePasswordDto, QueryUsersDto, UserRole, PaginatedUsersResponse } from "../types/user"; // Adjust import path as needed
import { ILoading, IPaginationMeta } from "@/types";

// Define the shape of our context
interface UserContextType {
  // State
  users: UserResponseDto[];
  loading: ILoading;
  error: string | null;
  filters: QueryUsersDto;
  pagination: IPaginationMeta;

  // Actions
  setFilters: (filters: QueryUsersDto) => void;
  createUser: (data: CreateUserDto) => Promise<UserResponseDto>;
  updateUser: (id: string, data: UpdateUserDto) => Promise<UserResponseDto>;
  deleteUser: (id: string) => Promise<void>;
  getOne: (id: string) => Promise<UserResponseDto>;
  changePassword: (id: string, data: ChangePasswordDto) => Promise<UserResponseDto>;
  toggleStatus: (id: string) => Promise<UserResponseDto>;
  refreshUsers: () => Promise<void>;
  clearError: () => void;
}

// Initial values
const defaultPagination: IPaginationMeta = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
};

const defaultLoading: ILoading = {
  table: false,
  form: false,
  submit: false,
  delete: false,
};

const defaultFilters: QueryUsersDto = {
  page: 1,
  limit: 10,
  search: "",
};

// Create context with undefined default value
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  // State
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [loading, setLoading] = useState<ILoading>(defaultLoading);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<QueryUsersDto>(defaultFilters);
  const [pagination, setPagination] = useState<IPaginationMeta>(defaultPagination);

  // Fetch users when filters change
  useEffect(() => {
    fetchUsers();
  }, [filters]);

  // Function to fetch users based on current filters
  const fetchUsers = useCallback(async () => {
    setLoading((prev) => ({ ...prev, table: true }));
    setError(null);

    try {
      const response: PaginatedUsersResponse = await userService.getAll(filters);
      setUsers(response.data);
      setPagination(response.meta);
    } catch (err: any) {
      setError(err.message || "Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading((prev) => ({ ...prev, table: false }));
    }
  }, [filters]);

  // Refresh users with current filters
  const refreshUsers = useCallback(async () => {
    await fetchUsers();
  }, [fetchUsers]);

  // Clear any errors
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Create a new user
  const createUser = useCallback(
    async (data: CreateUserDto): Promise<UserResponseDto> => {
      setLoading((prev) => ({ ...prev, submit: true }));
      setError(null);

      try {
        const newUser = await userService.create(data);
        // Refresh the user list
        await refreshUsers();
        return newUser;
      } catch (err: any) {
        setError(err.message || "Failed to create user");
        console.error("Error creating user:", err);
        throw err;
      } finally {
        setLoading((prev) => ({ ...prev, submit: false }));
      }
    },
    [refreshUsers]
  );

  // Update an existing user
  const updateUser = useCallback(async (id: string, data: UpdateUserDto): Promise<UserResponseDto> => {
    setLoading((prev) => ({ ...prev, submit: true }));
    setError(null);

    try {
      const updatedUser = await userService.update(id, data);
      // Update the user in the local state
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === id ? updatedUser : user)));
      return updatedUser;
    } catch (err: any) {
      setError(err.message || "Failed to update user");
      console.error("Error updating user:", err);
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  }, []);

  // Delete a user
  const deleteUser = useCallback(async (id: string): Promise<void> => {
    setLoading((prev) => ({ ...prev, delete: true }));
    setError(null);

    try {
      await userService.remove(id);
      // Remove the user from the local state
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      // Update pagination
      setPagination((prev) => ({
        ...prev,
        total: prev.total - 1,
        totalPages: Math.ceil((prev.total - 1) / prev.limit),
      }));
    } catch (err: any) {
      setError(err.message || "Failed to delete user");
      console.error("Error deleting user:", err);
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, delete: false }));
    }
  }, []);

  // Change a user's password
  const changePassword = useCallback(async (id: string, data: ChangePasswordDto): Promise<UserResponseDto> => {
    setLoading((prev) => ({ ...prev, submit: true }));
    setError(null);

    try {
      const updatedUser = await userService.changePassword(id, data);
      return updatedUser;
    } catch (err: any) {
      setError(err.message || "Failed to change password");
      console.error("Error changing password:", err);
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  }, []);

  // Toggle a user's active status
  const toggleStatus = useCallback(async (id: string): Promise<UserResponseDto> => {
    setLoading((prev) => ({ ...prev, submit: true }));
    setError(null);

    try {
      const updatedUser = await userService.toggleStatus(id);
      // Update the user in the local state
      setUsers((prevUsers) => prevUsers.map((user) => (user.id === id ? updatedUser : user)));
      return updatedUser;
    } catch (err: any) {
      setError(err.message || "Failed to toggle user status");
      console.error("Error toggling user status:", err);
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  }, []);

  const getOne = useCallback(async (id: string): Promise<UserResponseDto> => {
    setLoading((prev) => ({ ...prev, form: true }));
    setError(null);

    try {
      const user = await userService.getOne(id);
      return user;
    } catch (err: any) {
      setError(err.message || "Échec lors de la récupération de l'utilisateur");
      console.error("Error fetching user:", err);
      throw err;
    } finally {
      setLoading((prev) => ({ ...prev, form: false }));
    }
  }, []);

  // Context value
  const value: UserContextType = {
    users,
    loading,
    error,
    filters,
    pagination,
    setFilters,
    createUser,
    updateUser,
    deleteUser,
    getOne,
    changePassword,
    toggleStatus,
    refreshUsers,
    clearError,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook for using the context
export const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }

  return context;
};

export default UserContext;

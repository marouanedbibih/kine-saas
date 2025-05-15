import { IPaginationMeta } from ".";

// interface User {
//   id: string;
//   email: string;
//   name?: string;
// }

export enum UserRole {
  KINESITHERAPEUTE = "KINESITHERAPEUTE",
  ADMIN = "ADMIN",
}

export interface UserResponseDto {
  id: string;
  email: string;
  nom: string;
  prenom: string;
  role: UserRole;
  actif: boolean;
  dateCreation: string; // ISO format
  dateModification: string; // ISO format
}

export interface CreateUserDto {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  role: UserRole;
  actif?: boolean;
}

export interface UpdateUserDto {
  nom?: string;
  prenom?: string;
  role?: UserRole;
  actif?: boolean;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface QueryUsersDto {
  page?: number;
  limit?: number;
  search?: string;
  role?: UserRole;
  actif?: boolean;
}


// Paginated list of users
export interface PaginatedUsersResponse {
  data: UserResponseDto[];
  meta: IPaginationMeta;
}

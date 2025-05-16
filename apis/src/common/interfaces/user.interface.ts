import { UserRole } from './user-role.enum';

export interface UserDto {
  id: string;
  email: string;
  role: UserRole;
  nom?: string;
  prenom?: string;
  actif?: boolean;
}

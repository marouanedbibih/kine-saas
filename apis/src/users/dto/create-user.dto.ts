/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsEnum, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ 
    example: 'john.doe@example.com',
    description: 'Unique email address'
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    example: 'SecurePassword123!',
    description: 'Password must be at least 6 characters',
    minLength: 6
  })
  @IsNotEmpty()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;

  @ApiProperty({ 
    example: 'Doe',
    description: 'User last name'
  })
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ 
    example: 'John',
    description: 'User first name'
  })
  @IsNotEmpty()
  prenom: string;

  @ApiProperty({ 
    enum: UserRole,
    example: UserRole.KINESITHERAPEUTE,
    description: 'User role in the system'
  })
  @IsEnum(UserRole, { message: 'Role must be a valid UserRole' })
  @IsNotEmpty()
  role: UserRole;

  @ApiProperty({ 
    example: true,
    description: 'Whether the user account is active',
    default: true,
    required: false
  })
  @IsOptional()
  actif?: boolean;
}
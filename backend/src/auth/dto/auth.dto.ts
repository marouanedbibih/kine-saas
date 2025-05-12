import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'admin@kinesaas.ma',
    description: 'User email address',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'User password',
    minLength: 6,
  })
  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Refresh token',
  })
  @IsNotEmpty({ message: 'Refresh token is required' })
  refreshToken: string;
}

export class TokenResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken: string;

  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT refresh token',
  })
  refreshToken: string;

  @ApiProperty({
    example: 900,
    description: 'Access token expiration time in seconds',
  })
  expiresIn: number;

  @ApiProperty({
    example: 'Bearer',
    description: 'Token type',
  })
  tokenType: string;
}

export class AuthUserDto {
  @ApiProperty({
    example: 'uuid-string',
    description: 'User ID',
  })
  id: string;

  @ApiProperty({
    example: 'admin@kinesaas.ma',
    description: 'User email',
  })
  email: string;

  @ApiProperty({
    example: 'Admin',
    description: 'User first name',
  })
  prenom: string;

  @ApiProperty({
    example: 'System',
    description: 'User last name',
  })
  nom: string;

  @ApiProperty({
    example: 'ADMIN',
    description: 'User role',
  })
  role: string;

  @ApiProperty({
    example: true,
    description: 'User active status',
  })
  actif: boolean;
}

export class LoginResponseDto {
  @ApiProperty()
  user: AuthUserDto;

  @ApiProperty()
  tokens: TokenResponseDto;
}

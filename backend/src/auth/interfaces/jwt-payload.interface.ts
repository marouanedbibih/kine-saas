export interface JwtPayload {
  sub: string; // User ID
  email: string;
  role: string;
  iat?: number; // Issued at
  exp?: number; // Expires at
}

export interface RefreshTokenPayload extends JwtPayload {
  tokenVersion?: number; // For token invalidation
}

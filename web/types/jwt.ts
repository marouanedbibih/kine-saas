export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface TokenResult {
  email: string;
  role: string;
  isValid: boolean;
  token?: string;
}
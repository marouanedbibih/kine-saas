export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    prenom: string;
    nom: string;
    role: 'ADMIN' | 'ASSISTANT' | 'KINESITHERAPEUTE' | string;
    actif: boolean;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    tokenType: 'Bearer' | string;
  };
}

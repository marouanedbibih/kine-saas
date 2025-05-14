// src/services/jwt.service.ts
import { JwtPayload, TokenResult } from '@/types/jwt';
import { jwtDecode } from 'jwt-decode'; 



/**
 * JWT Service for handling token operations
 */
export class JwtService {
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly USER_INFO_KEY = 'user_info';

  /**
   * Decode and validate a JWT token
   * @param token The JWT token to decode and validate
   * @returns TokenResult with email, role, and validity status
   */
  decodeToken(token: string): TokenResult {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      
      // Check if token is expired
      const isValid = decoded.exp * 1000 > Date.now();
      
      return {
        email: decoded.email,
        role: decoded.role,
        isValid,
        token
      };
    } catch (error) {
      // Return invalid token result if decoding fails
      return {
        email: '',
        role: '',
        isValid: false
      };
    }
  }

  /**
   * Store the JWT token and user information in localStorage
   * @param token The JWT token to store
   * @returns TokenResult with the decoded and validated information
   */
  setToken(token: string): TokenResult {
    if (typeof window !== 'undefined') {
      const tokenResult = this.decodeToken(token);
      
      if (tokenResult.isValid) {
        localStorage.setItem(this.TOKEN_KEY, token);
        localStorage.setItem(this.USER_INFO_KEY, JSON.stringify({
          email: tokenResult.email,
          role: tokenResult.role
        }));
      }
      
      return tokenResult;
    }
    
    return {
      email: '',
      role: '',
      isValid: false
    };
  }

  /**
   * Retrieve the JWT token from localStorage
   * @returns The stored JWT token or null if not found
   */
  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  /**
   * Retrieve and validate the stored JWT token
   * @returns TokenResult with the decoded and validated information
   */
  getTokenInfo(): TokenResult {
    const token = this.getToken();
    
    if (token) {
      return this.decodeToken(token);
    }
    
    return {
      email: '',
      role: '',
      isValid: false
    };
  }

  /**
   * Check if there is a valid JWT token stored
   * @returns True if a valid token exists, false otherwise
   */
  isAuthenticated(): boolean {
    return this.getTokenInfo().isValid;
  }

  /**
   * Get the role from the stored JWT token
   * @returns The user role or empty string if no valid token
   */
  getUserRole(): string {
    return this.getTokenInfo().role;
  }

  /**
   * Get the email from the stored JWT token
   * @returns The user email or empty string if no valid token
   */
  getUserEmail(): string {
    return this.getTokenInfo().email;
  }

  /**
   * Remove the stored JWT token and user information
   */
  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_INFO_KEY);
    }
  }
}

// Export a singleton instance for use throughout the application
export const jwtService = new JwtService();
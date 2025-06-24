package org.kine.backend.modules.auth.services;

import org.kine.backend.modules.auth.http.LoginRequest;
import org.kine.backend.modules.auth.http.LoginResponse;

/**
 * Authentication Service Interface
 * Defines the contract for authentication operations
 */
public interface IAuthService {

    /**
     * Authenticates a user with email and password
     * 
     * @param loginRequest the login request containing email and password
     * @return AuthResponse containing access and refresh tokens
     * @throws org.springframework.security.core.AuthenticationException if authentication fails
     */
    LoginResponse login(LoginRequest loginRequest);
}

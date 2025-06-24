package org.kine.backend.modules.auth.controllers;

import org.kine.backend.modules.auth.http.LoginRequest;
import org.kine.backend.modules.auth.http.LoginResponse;
import org.kine.backend.modules.auth.services.IAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

/**
 * Authentication Controller
 * Handles user authentication operations
 */
@RestController
public class AuthController {
    
    
    @Autowired
    private IAuthService authService;
    
    /**
     * User login endpoint
     * 
     * @param loginRequest the login request containing email and password
     * @return ResponseEntity containing login response with JWT token and user info
     */
    @PostMapping("/api/v1/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }
}

package org.kine.backend.modules.auth.services;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.kine.backend.enums.UserRole;
import org.kine.backend.modules.auth.http.LoginRequest;
import org.kine.backend.modules.auth.http.LoginResponse;
import org.kine.backend.modules.cabinet.Cabinet;
import org.kine.backend.modules.cabinet.CabinetRepository;
import org.kine.backend.modules.user.User;
import org.kine.backend.modules.user.dto.UserDTO;
import org.kine.backend.security.jwt.JwtUtils;

/**
 * Authentication Service Implementation
 * Handles user authentication and JWT token generation
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements IAuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final CabinetRepository cabinetRepository;

    /**
     * Authenticates a user with email and password
     * 
     * @param loginRequest the login request containing email and password
     * @return LoginResponse containing access and refresh tokens
     * @throws AuthenticationException if authentication fails
     */
    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        log.debug("Attempting to authenticate user with email: {}", loginRequest.getEmail());

        try {
            // Create authentication token with normalized email
            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail().trim().toLowerCase(),
                    loginRequest.getPassword()
            );

            // Authenticate the user
            Authentication authentication = authenticationManager.authenticate(authToken);

            // Get the authenticated user
            User user = (User) authentication.getPrincipal();
            log.info("User successfully authenticated: {}", user.getEmail());

            // Convert User entity to UserDTO
            UserDTO userDTO = UserDTO.fromEntity(user);

            // Determine cabinetId based on user role
            String cabinetId = determineCabinetId(user);

            // Generate JWT tokens
            String accessToken = jwtUtils.createToken(userDTO, cabinetId);
            String refreshToken = jwtUtils.createRefreshToken(userDTO.getEmail(), userDTO.getId().toString());

            log.debug("JWT tokens generated successfully for user: {}", user.getEmail());

            return new LoginResponse(accessToken, refreshToken);

        } catch (AuthenticationException e) {
            log.warn("Authentication failed for email: {} - {}", loginRequest.getEmail(), e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Unexpected error during authentication for email: {}", loginRequest.getEmail(), e);
            throw new BadCredentialsException("Authentication failed due to internal error", e);
        }
    }

    /**
     * Determines the cabinet ID for the user based on their role
     * 
     * @param user the authenticated user
     * @return cabinet ID string or null for admins
     * @throws BadCredentialsException if cabinet cannot be determined for non-admin users
     */
    private String determineCabinetId(User user) {
        if (user.getRole() == UserRole.ADMIN) {
            log.debug("Admin user authenticated, no cabinet restriction");
            return null; // Admins have access to all cabinets
        }

        // For non-admin users (therapists), find their associated cabinet
        try {
            Cabinet cabinet = cabinetRepository.findByTherapistId(user.getId())
                    .orElseThrow(() -> {
                        log.warn("No cabinet found for non-admin user: {}", user.getEmail());
                        return new BadCredentialsException("No cabinet access found for user: " + user.getEmail());
                    });
            
            log.debug("Cabinet found for user {}: {}", user.getEmail(), cabinet.getId());
            return cabinet.getId().toString();
            
        } catch (BadCredentialsException e) {
            throw e; // Re-throw authentication exceptions
        } catch (Exception e) {
            log.error("Unexpected error finding cabinet for user: {}", user.getEmail(), e);
            throw new BadCredentialsException("Unable to determine user cabinet access", e);
        }
    }
}

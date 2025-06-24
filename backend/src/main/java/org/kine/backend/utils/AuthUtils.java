package org.kine.backend.utils;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.kine.backend.enums.UserRole;
import org.kine.backend.modules.user.User;
import org.kine.backend.security.jwt.JwtUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * Utility class to access authentication information from Security Context
 * Extracts user details, roles and cabinet information from JWT tokens
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AuthUtils {
    
    private final JwtUtils jwtUtils;
    

    public Authentication getCurrentAuthentication() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        return authentication;
    }

    public User getCurrentUser() {
        Authentication authentication = getCurrentAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        
        // Assuming the principal is of type User
        Object principal = authentication.getPrincipal();
        if (principal instanceof User) {
            return (User) principal;
        } else {
            log.warn("Current principal is not of type User: {}", principal.getClass().getName());
            return null;
        }
    }
    
    
    /**
     * Get the current authenticated user's cabinet ID from security context
     * 
     * @return UUID of current user's cabinet, null if user is admin or not authenticated
     */
    public UUID getCurrentCabinetId() {
        String token = getTokenFromContext();
        if (token == null) {
            return null;
        }
        
        try {
            String cabinetId = jwtUtils.extractCabinetId(token);
            return cabinetId != null ? UUID.fromString(cabinetId) : null;
        } catch (Exception e) {
            log.error("Failed to extract cabinet ID from token", e);
            return null;
        }
    }
    
    /**
     * Check if current user has ADMIN role
     * 
     * @return true if user has ADMIN role, false otherwise
     */
    public boolean isAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getAuthorities()
                    .stream()
                    .map(GrantedAuthority::getAuthority)
                    .anyMatch(authority -> authority.equals("ROLE_" + UserRole.ADMIN.name()));
        }
        
        // Alternative way using JWT token if authorities are not properly set up
        String token = getTokenFromContext();
        if (token != null) {
            try {
                String role = jwtUtils.extractRole(token);
                return UserRole.ADMIN.name().equals(role);
            } catch (Exception e) {
                log.error("Failed to extract role from token", e);
            }
        }
        
        return false;
    }
    
    /**
     * Check if current user has THERAPIST role
     * 
     * @return true if user has THERAPIST role, false otherwise
     */
    public boolean isTherapist() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            return authentication.getAuthorities()
                    .stream()
                    .map(GrantedAuthority::getAuthority)
                    .anyMatch(authority -> authority.equals("ROLE_" + UserRole.THERAPIST.name()));
        }
        
        // Alternative way using JWT token if authorities are not properly set up
        String token = getTokenFromContext();
        if (token != null) {
            try {
                String role = jwtUtils.extractRole(token);
                return UserRole.THERAPIST.name().equals(role);
            } catch (Exception e) {
                log.error("Failed to extract role from token", e);
            }
        }
        
        return false;
    }
    
    /**
     * Check if the current user's role matches the given role
     *
     * @param role Role to check against
     * @return true if roles match, false otherwise
     */
    public boolean hasRole(UserRole role) {
        String token = getTokenFromContext();
        if (token == null || role == null) {
            return false;
        }
        
        try {
            String userRole = jwtUtils.extractRole(token);
            return role.name().equals(userRole);
        } catch (Exception e) {
            log.error("Failed to extract role from token", e);
            return false;
        }
    }
    
    /**
     * Check if current user has access to the specified cabinet
     * Admins have access to all cabinets
     * Therapists have access only to their assigned cabinet
     *
     * @param cabinetId Cabinet ID to check access for
     * @return true if user has access, false otherwise
     */
    public boolean hasCabinetAccess(UUID cabinetId) {
        if (cabinetId == null) {
            return false;
        }
        
        // Admins have access to all cabinets
        if (isAdmin()) {
            return true;
        }
        
        // Therapists can only access their assigned cabinet
        UUID userCabinetId = getCurrentCabinetId();
        return userCabinetId != null && userCabinetId.equals(cabinetId);
    }
    
    
    /**
     * Helper method to extract JWT token from security context
     * 
     * @return JWT token string without Bearer prefix, null if not available
     */
    private String getTokenFromContext() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        
        // Try to get token from principal or credentials
        Object credentials = authentication.getCredentials();
        if (credentials != null && credentials instanceof String) {
            return (String) credentials;
        }
        
        // If credentials approach fails, try to extract from details
        // This assumes token is stored in the authentication details by JwtAuthenticationFilter
        Object details = authentication.getDetails();
        if (details != null && details instanceof String) {
            return (String) details;
        }
        
        // Last resort: Try to get from name if it happens to be the token (not recommended)
        String name = authentication.getName();
        if (name != null && name.startsWith("eyJ")) { // Simple check for JWT format
            return name;
        }
        
        log.warn("Could not find JWT token in authentication context");
        return null;
    }
    
}
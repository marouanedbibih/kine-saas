package org.kine.backend.security.jwt;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.kine.backend.enums.UserRole;
import org.kine.backend.modules.user.dto.UserDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

/**
 * JWT Utility class for token generation, validation, and claim extraction
 * Handles access tokens and refresh tokens with custom claims
 */
@Component
@Slf4j
public class JwtUtils {
    
    @Value("${app.jwt.secret:QAR1At+Vv3rNXrmiHGcZ0tG3+EPgdkeVi/HqjgcUbf8WcgdgpCXDTjb7CnIv9WEL}")
    private String secretKey;
    
    @Value("${app.jwt.access-token-expiration:86400000}") // 24 hours in milliseconds
    private long accessTokenExpiration;
    
    @Value("${app.jwt.refresh-token-expiration:2592000000}") // 30 days in milliseconds
    private long refreshTokenExpiration;

    /**
     * Extract username (email) from JWT token
     * 
     * @param token JWT token
     * @return username/email
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extract user role from JWT token
     * 
     * @param token JWT token
     * @return user role as string
     */
    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }

    /**
     * Extract cabinet ID from JWT token
     * 
     * @param token JWT token
     * @return cabinet ID as string, null if not present or user is admin
     */
    public String extractCabinetId(String token) {
        return extractClaim(token, claims -> claims.get("cabinetId", String.class));
    }

    /**
     * Create JWT access token with user details and custom claims
     * 
     * @param user UserDTO containing user information
     * @param cabinetId Cabinet ID for non-admin users, null for admins
     * @return JWT access token
     */
    public String createToken(UserDTO user, String cabinetId) {
        log.debug("Creating JWT token for user: {} with role: {}", user.getEmail(), user.getRole());

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("role", user.getRole().toString());
        extraClaims.put("userId", user.getId().toString());

        // Add cabinet ID for non-admin users only
        if (user.getRole() != UserRole.ADMIN && cabinetId != null) {
            extraClaims.put("cabinetId", cabinetId);
            log.debug("Added cabinet ID to token: {}", cabinetId);
        } else {
            extraClaims.put("cabinetId", null);
            log.debug("No cabinet restriction for admin user or missing cabinet ID");
        }

        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(user.getEmail())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Validate JWT token against user details
     * 
     * @param token JWT token to validate
     * @param user UserDetails for validation
     * @return true if token is valid, false otherwise
     */
    public boolean isTokenValid(String token, UserDetails user) {
        try {
            final String email = extractUsername(token);
            return (email.equals(user.getUsername())) && !isTokenExpired(token);
        } catch (Exception e) {
            log.warn("Token validation failed: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Check if JWT token is expired
     * 
     * @param token JWT token
     * @return true if expired, false otherwise
     */
    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Extract expiration date from JWT token
     * 
     * @param token JWT token
     * @return expiration date
     */
    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extract specific claim from JWT token
     * 
     * @param token JWT token
     * @param claimsResolver function to extract specific claim
     * @return extracted claim value
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extract all claims from JWT token
     * 
     * @param token JWT token
     * @return all claims
     */
    public Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Get signing key for JWT token operations
     * 
     * @return signing key
     */
    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Extract Bearer token from Authorization header
     * 
     * @param header Authorization header
     * @return JWT token without Bearer prefix
     */
    public String extractToken(String header) {
        if (header != null && header.startsWith("Bearer ")) {
            return header.replace("Bearer ", "").trim();
        }
        return null;
    }

    /**
     * Create refresh token with basic claims
     * 
     * @param email user email
     * @param userId user ID
     * @return JWT refresh token
     */
    public String createRefreshToken(String email, String userId) {
        log.debug("Creating refresh token for user: {}", email);

        Map<String, Object> extraClaims = new HashMap<>();
        extraClaims.put("email", email);
        extraClaims.put("userId", userId);
        extraClaims.put("tokenType", "refresh");

        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(email)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Check if token is a refresh token
     * 
     * @param token JWT token
     * @return true if it's a refresh token, false otherwise
     */
    public boolean isRefreshToken(String token) {
        try {
            String tokenType = extractClaim(token, claims -> claims.get("tokenType", String.class));
            return "refresh".equals(tokenType);
        } catch (Exception e) {
            log.warn("Failed to check if token is refresh token: {}", e.getMessage());
            return false;
        }
    }
}

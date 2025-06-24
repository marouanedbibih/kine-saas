package org.kine.backend.security;

import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j
public class CustomAuthProvider implements AuthenticationProvider {

    private final CustomUserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        String username = authentication.getName();
        String password = (String) authentication.getCredentials();

        // Validate input parameters
        if (username == null || username.trim().isEmpty()) {
            log.warn("Authentication attempt with empty username");
            throw new BadCredentialsException("Username cannot be empty");
        }

        if (password == null || password.isEmpty()) {
            log.warn("Authentication attempt with empty password for username: {}", username);
            throw new BadCredentialsException("Password cannot be empty");
        }

        UserDetails user;
        try {
            log.debug("Loading user details for username: {}", username);
            user = userDetailsService.loadUserByUsername(username);
        } catch (UsernameNotFoundException e) {
            log.warn("User not found: {}", username);
            throw new BadCredentialsException("Invalid username or password", e);
        } catch (Exception e) {
            log.error("Unexpected error while loading user details for username: {}", username, e);
            throw new BadCredentialsException("Authentication service temporarily unavailable", e);
        }

        // Check if user account is enabled
        if (!user.isEnabled()) {
            log.warn("Authentication attempt for disabled user: {}", username);
            throw new DisabledException("User account is disabled");
        }

        // Check if user account is not locked
        if (!user.isAccountNonLocked()) {
            log.warn("Authentication attempt for locked user: {}", username);
            throw new LockedException("User account is locked");
        }

        // Check if user account is not expired
        if (!user.isAccountNonExpired()) {
            log.warn("Authentication attempt for expired user: {}", username);
            throw new DisabledException("User account has expired");
        }

        // Check if user credentials are not expired
        if (!user.isCredentialsNonExpired()) {
            log.warn("Authentication attempt with expired credentials for user: {}", username);
            throw new DisabledException("User credentials have expired");
        }

        // Verify password
        try {
            if (!passwordEncoder.matches(password, user.getPassword())) {
                log.warn("Invalid password for user: {}", username);
                throw new BadCredentialsException("Invalid username or password");
            }
        } catch (Exception e) {
            log.error("Error during password verification for user: {}", username, e);
            throw new BadCredentialsException("Authentication failed", e);
        }

        log.info("Successful authentication for user: {}", username);
        return new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }
}

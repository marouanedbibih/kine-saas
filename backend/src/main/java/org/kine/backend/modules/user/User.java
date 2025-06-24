package org.kine.backend.modules.user;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import org.kine.backend.enums.UserRole;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;
import java.util.UUID;

/**
 * Base User entity implementing Spring Security UserDetails
 * Serves as the parent class for all user types in the system
 */
@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class User implements UserDetails {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(unique = true, nullable = false)
    @NotBlank(message = "Email is required")
    @Email(message = "Email must be valid")
    private String email;

    @Column(nullable = false)
    @NotBlank(message = "Password is required")
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @NotNull(message = "User role is required")
    private UserRole role;
    
    @Column(nullable = false)
    private boolean accountNonExpired = true;
    
    @Column(nullable = false)
    private boolean accountNonLocked = true;
    
    @Column(nullable = false)
    private boolean credentialsNonExpired = true;
    
    @Column(nullable = false)
    private boolean enabled = true;

    /**
     * Check if user has a specific role
     * 
     * @param role the role to check
     * @return true if user has the role, false otherwise
     */
    public boolean hasRole(UserRole role) {
        return this.role == role;
    }
    
    /**
     * Check if user is an admin
     * 
     * @return true if user is admin, false otherwise
     */
    public boolean isAdmin() {
        return this.role == UserRole.ADMIN;
    }
    
    /**
     * Check if user is a therapist
     * 
     * @return true if user is therapist, false otherwise
     */
    public boolean isTherapist() {
        return this.role == UserRole.THERAPIST;
    }
    
    // Spring Security UserDetails implementation methods
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }
    
    @Override
    public String getUsername() {
        return email; // Using email as the username
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return accountNonExpired;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        return accountNonLocked;
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return credentialsNonExpired;
    }
    
    @Override
    public boolean isEnabled() {
        return enabled;
    }
}
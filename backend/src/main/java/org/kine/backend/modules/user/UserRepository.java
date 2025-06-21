package org.kine.backend.modules.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import org.kine.backend.enums.UserRole;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for User entity operations.
 * Provides CRUD operations and custom queries for User management.
 */
@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    /**
     * Find a user by email address.
     * 
     * @param email the email to search for
     * @return Optional containing the user if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if a user exists with the given email.
     * 
     * @param email the email to check
     * @return true if user exists, false otherwise
     */
    boolean existsByEmail(String email);

    /**
     * Find all users with a specific role.
     * 
     * @param role the user role to filter by
     * @return list of users with the specified role
     */
    List<User> findByRole(UserRole role);

    /**
     * Find all users whose accounts are not expired.
     * 
     * @return list of users with non-expired accounts
     */
    List<User> findByAccountNonExpiredTrue();

    /**
     * Find all users whose accounts are not locked.
     * 
     * @return list of users with non-locked accounts
     */
    List<User> findByAccountNonLockedTrue();

    /**
     * Find all enabled users (account and credentials non-expired, non-locked).
     * 
     * @return list of enabled users
     */
    @Query("SELECT u FROM User u WHERE u.accountNonExpired = true AND u.accountNonLocked = true AND u.credentialsNonExpired = true AND u.enabled = true")
    List<User> findAllEnabledUsers();

    /**
     * Count users by role.
     * 
     * @param role the user role to count
     * @return number of users with the specified role
     */
    long countByRole(UserRole role);

    /**
     * Find users by email containing the given text (case-insensitive).
     * 
     * @param email the email pattern to search for
     * @return list of users whose email contains the pattern
     */
    List<User> findByEmailContainingIgnoreCase(String email);
}

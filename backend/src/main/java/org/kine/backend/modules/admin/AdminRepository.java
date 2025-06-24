package org.kine.backend.modules.admin;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for Admin entity operations.
 * Provides CRUD operations and custom queries for Admin management.
 */
@Repository
public interface AdminRepository extends JpaRepository<Admin, UUID> {

    /**
     * Find an admin by email address.
     * 
     * @param email the email to search for
     * @return Optional containing the admin if found
     */
    Optional<Admin> findByEmail(String email);

    /**
     * Find all active admins (enabled accounts).
     * 
     * @return list of active admins
     */
    List<Admin> findByEnabledTrue();

    /**
     * Search admins by name or email (case-insensitive).
     * 
     * @param searchTerm the search term
     * @return list of admins matching the search criteria
     */
    @Query("SELECT a FROM Admin a WHERE " +
           "LOWER(a.fullName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(a.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Admin> searchByNameOrEmail(@Param("searchTerm") String searchTerm);

    /**
     * Find admins whose accounts are not expired.
     * 
     * @return list of admins with non-expired accounts
     */
    List<Admin> findByAccountNonExpiredTrue();

    /**
     * Find admins whose accounts are not locked.
     * 
     * @return list of admins with non-locked accounts
     */
    List<Admin> findByAccountNonLockedTrue();

    /**
     * Find admins whose credentials are not expired.
     * 
     * @return list of admins with non-expired credentials
     */
    List<Admin> findByCredentialsNonExpiredTrue();

    /**
     * Check if admin exists by email.
     * 
     * @param email the email to check
     * @return true if admin exists, false otherwise
     */
    boolean existsByEmail(String email);

    /**
     * Count total number of admins.
     * 
     * @return total count of admins
     */
    @Query("SELECT COUNT(a) FROM Admin a")
    long countAllAdmins();

    /**
     * Count active admins.
     * 
     * @return count of active admins
     */
    long countByEnabledTrue();
}

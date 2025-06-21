package org.kine.backend.modules.therapist;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.kine.backend.modules.cabinet.Cabinet;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for Therapist entity operations.
 * Provides CRUD operations and custom queries for Therapist management.
 */
@Repository
public interface TherapistRepository extends JpaRepository<Therapist, UUID> {

    /**
     * Find a therapist by email address.
     * 
     * @param email the email to search for
     * @return Optional containing the therapist if found
     */
    Optional<Therapist> findByEmail(String email);

    /**
     * Find therapists by cabinet.
     * 
     * @param cabinet the cabinet to filter by
     * @return list of therapists working in the specified cabinet
     */
    List<Therapist> findByCabinet(Cabinet cabinet);

    /**
     * Find all active therapists (enabled accounts).
     * 
     * @return list of active therapists
     */
    List<Therapist> findByEnabledTrue();

    /**
     * Search therapists by name, email, or specialty.
     * 
     * @param searchTerm the search term
     * @return list of therapists matching the search criteria
     */
    @Query("SELECT t FROM Therapist t WHERE " +
           "LOWER(t.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(t.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(t.email) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(t.specialty) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Therapist> search(@Param("searchTerm") String searchTerm);

    /**
     * Count therapists by cabinet.
     * 
     * @param cabinet the cabinet to count therapists for
     * @return number of therapists in the specified cabinet
     */
    long countByCabinet(Cabinet cabinet);


    /**
     * Check if therapist exists by email.
     * 
     * @param email the email to check
     * @return true if therapist exists, false otherwise
     */
    boolean existsByEmail(String email);

}

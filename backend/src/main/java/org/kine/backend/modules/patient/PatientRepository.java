package org.kine.backend.modules.patient;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.kine.backend.enums.Gender;
import org.kine.backend.modules.cabinet.Cabinet;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for Patient entity operations.
 * Provides CRUD operations and custom queries for Patient management.
 */
@Repository
public interface PatientRepository extends JpaRepository<Patient, UUID> {

    /**
     * Find a patient by email address.
     * 
     * @param email the email to search for
     * @return Optional containing the patient if found
     */
    Optional<Patient> findByEmail(String email);


    /**
     * Find patients by gender.
     * 
     * @param gender the gender to filter by
     * @return list of patients with the specified gender
     */
    List<Patient> findByGender(Gender gender);

    /**
     * Find patients by cabinet.
     * 
     * @param cabinet the cabinet to filter by
     * @return list of patients belonging to the specified cabinet
     */
    List<Patient> findByCabinet(Cabinet cabinet);

    /**
     * Find patients born between two dates.
     * 
     * @param startDate the start date
     * @param endDate the end date
     * @return list of patients born in the specified date range
     */
    List<Patient> findByDateOfBirthBetween(Date startDate, Date endDate);

    /**
     * Search patients by name or email (case-insensitive).
     * 
     * @param searchTerm the search term
     * @return list of patients matching the search criteria
     */
    @Query("SELECT p FROM Patient p WHERE " +
           "LOWER(p.firstName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.lastName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(p.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Patient> searchByNameOrEmail(@Param("searchTerm") String searchTerm);

    /**
     * Count patients by cabinet.
     * 
     * @param cabinet the cabinet to count patients for
     * @return number of patients in the specified cabinet
     */
    long countByCabinet(Cabinet cabinet);

    /**
     * Check if patient exists by email.
     * 
     * @param email the email to check
     * @return true if patient exists, false otherwise
     */
    boolean existsByEmail(String email);
}

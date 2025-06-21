package org.kine.backend.modules.cabinet;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

/**
 * Repository interface for Cabinet entity operations.
 * Provides CRUD operations and custom queries for Cabinet management.
 */
@Repository
public interface CabinetRepository extends JpaRepository<Cabinet, UUID> {

    /**
     * Search cabinets by name, city, or address (case-insensitive).
     * 
     * @param searchTerm the search term
     * @return list of cabinets matching the search criteria
     */
    @Query("SELECT c FROM Cabinet c WHERE " +
           "LOWER(c.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.city) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.address) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<Cabinet> search(@Param("searchTerm") String searchTerm);

    /**
     * Find cabinets with their patient count.
     * 
     * @return list of cabinets with patient counts
     */
    @Query("SELECT c, COUNT(p) FROM Cabinet c LEFT JOIN c.patients p GROUP BY c")
    List<Object[]> findCabinetsWithPatientCount();

    /**
     * Find cabinets with their therapist count.
     * 
     * @return list of cabinets with therapist counts
     */
    @Query("SELECT c, COUNT(t) FROM Cabinet c LEFT JOIN c.therapists t GROUP BY c")
    List<Object[]> findCabinetsWithTherapistCount();

    /**
     * Find cabinets that have both patients and therapists.
     * 
     * @return list of active cabinets
     */
    @Query("SELECT DISTINCT c FROM Cabinet c WHERE " +
           "EXISTS (SELECT 1 FROM c.patients) AND " +
           "EXISTS (SELECT 1 FROM c.therapists)")
    List<Cabinet> findActiveCabinets();

    /**
     * Find cabinets with no patients.
     * 
     * @return list of cabinets with no patients
     */
    @Query("SELECT c FROM Cabinet c WHERE c.patients IS EMPTY")
    List<Cabinet> findCabinetsWithNoPatients();

    /**
     * Find cabinets with no therapists.
     * 
     * @return list of cabinets with no therapists
     */
    @Query("SELECT c FROM Cabinet c WHERE c.therapists IS EMPTY")
    List<Cabinet> findCabinetsWithNoTherapists();

}

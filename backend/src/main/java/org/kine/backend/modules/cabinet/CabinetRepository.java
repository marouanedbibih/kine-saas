package org.kine.backend.modules.cabinet;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for Cabinet entity operations.
 * Provides CRUD operations and custom queries for Cabinet management.
 */
@Repository
public interface CabinetRepository extends JpaRepository<Cabinet, UUID> {


    /**
     * Find a cabinet by a therapist's ID
     * 
     * Since 'therapistId' is not a direct property of Cabinet but rather
     * the Cabinet has a list of Therapists, we need to use JPQL to create this query.
     */
    @Query("SELECT c FROM Cabinet c JOIN c.therapists t WHERE t.id = :therapistId")
    Optional<Cabinet> findByTherapistId(@Param("therapistId") UUID therapistId);

}

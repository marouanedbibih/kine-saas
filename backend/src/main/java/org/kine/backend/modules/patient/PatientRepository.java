package org.kine.backend.modules.patient;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

/**
 * Repository interface for Patient entity operations.
 * Provides CRUD operations and custom queries for Patient management.
 */
@Repository
public interface PatientRepository extends JpaRepository<Patient, UUID> {

    Page<Patient> findAllByCabinetId(UUID cabinetId, Pageable pageable);

    Optional<Patient> findByIdAndCabinetId(UUID id, UUID cabinetId);

    @Query("""
                SELECT p FROM Patient p
                WHERE
                    LOWER(CONCAT(p.firstName, ' ', p.lastName)) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR LOWER(p.email) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR LOWER(p.phone) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR LOWER(p.altPhone) LIKE LOWER(CONCAT('%', :keyword, '%'))
                    OR LOWER(p.city) LIKE LOWER(CONCAT('%', :keyword, '%'))
            """)
    Page<Patient> search(@Param("keyword") String keyword, Pageable pageable);

}

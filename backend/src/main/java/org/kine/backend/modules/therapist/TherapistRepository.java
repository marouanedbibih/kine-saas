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


}

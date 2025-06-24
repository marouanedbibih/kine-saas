package org.kine.backend.modules.session;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.kine.backend.modules.patient.Patient;
import org.kine.backend.modules.therapist.Therapist;

import java.util.Date;
import java.util.List;
import java.util.UUID;

/**
 * Repository interface for Session entity operations.
 * Provides CRUD operations and custom queries for Session management.
 */
@Repository
public interface SessionRepository extends JpaRepository<Session, UUID> {

}

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

}

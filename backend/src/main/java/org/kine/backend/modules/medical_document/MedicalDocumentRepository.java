package org.kine.backend.modules.medical_document;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import org.kine.backend.modules.patient.Patient;

import java.util.List;
import java.util.UUID;

/**
 * Repository interface for MedicalDocument entity operations.
 * Provides CRUD operations and custom queries for MedicalDocument management.
 */
@Repository
public interface MedicalDocumentRepository extends JpaRepository<MedicalDocument, UUID> {

}

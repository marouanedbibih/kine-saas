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

    /**
     * Find medical documents by patient.
     * 
     * @param patient the patient to filter by
     * @return list of medical documents for the specified patient
     */
    List<MedicalDocument> findByPatient(Patient patient);

    /**
     * Find medical documents by file URL.
     * 
     * @param fileUrl the file URL to search for
     * @return list of medical documents with the specified file URL
     */
    List<MedicalDocument> findByFileUrl(String fileUrl);

    /**
     * Search medical documents by title or description (case-insensitive).
     * 
     * @param searchTerm the search term
     * @return list of medical documents matching the search criteria
     */
    @Query("SELECT md FROM MedicalDocument md WHERE " +
           "LOWER(md.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(md.description) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<MedicalDocument> search(@Param("searchTerm") String searchTerm);

}

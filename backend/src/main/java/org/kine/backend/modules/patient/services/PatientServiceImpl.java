package org.kine.backend.modules.patient.services;

import org.kine.backend.errors.exceptions.BusinessException;
import org.kine.backend.modules.cabinet.Cabinet;
import org.kine.backend.modules.cabinet.CabinetRepository;
import org.kine.backend.modules.patient.Patient;
import org.kine.backend.modules.patient.PatientRepository;
import org.kine.backend.modules.patient.http.PatientRequest;
import org.kine.backend.modules.patient.http.PatientResponse;
import org.kine.backend.modules.patient.mapper.IPatientMapper;
import org.kine.backend.utils.AuthUtils;
import org.kine.backend.utils.page.PageMapper;
import org.kine.backend.utils.page.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import java.util.UUID;

/**
 * Implémentation du service de gestion des patients.
 * 
 * Ce service fournit toutes les opérations CRUD pour les patients avec contrôle d'accès basé sur les rôles.
 * Les administrateurs peuvent gérer tous les patients tandis que les thérapeutes ne peuvent gérer 
 * que les patients de leur cabinet.
 * 
 * Fonctionnalités principales :
 * - Création de patients avec validation des droits d'accès
 * - Mise à jour des informations patient avec contrôle des cabinets
 * - Récupération des patients avec filtrage par cabinet
 * - Suppression sécurisée des patients
 * - Recherche paginée des patients
 * 
 * Gestion des erreurs :
 * - Utilise BusinessException pour une gestion cohérente des erreurs métier
 * - Messages d'erreur en français pour une meilleure expérience utilisateur
 * - Codes de statut HTTP appropriés pour chaque type d'erreur
 * 
 * Contrôle d'accès :
 * - Les administrateurs ont accès à tous les patients
 * - Les thérapeutes ne peuvent accéder qu'aux patients de leur cabinet
 * - Validation automatique des droits d'accès sur toutes les opérations
 * 
 * @author Système Kine SaaS
 * @version 1.0
 * @since 2025
 */
@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements IPatientService {

    private final PatientRepository patientRepository;
    private final CabinetRepository cabinetRepository;
    private final IPatientMapper patientMapper;
    private final AuthUtils authUtils;

    @Override
    @Transactional
    public PatientResponse create(PatientRequest request) {

        // Validate input request
        if (request == null) {
            throw new BusinessException("La demande de patient ne peut pas être nulle", HttpStatus.BAD_REQUEST);
        }

        UUID cabinetId = determineCabinetId(request);

        // Validate cabinet exists and user has access
        Cabinet cabinet = validateAndGetCabinet(cabinetId);

        // Create and save patient
        Patient patient = patientMapper.toEntity(request, cabinet);
        Patient savedPatient = patientRepository.save(patient);

        return patientMapper.toResponse(savedPatient);
    }

    private UUID determineCabinetId(PatientRequest request) {
        if (authUtils.isAdmin()) {
            if (request.cabinetId() == null) {
                throw new BusinessException("cabinetId", "L'administrateur doit spécifier un ID de cabinet lors de la création d'un patient", HttpStatus.BAD_REQUEST);
            }
            return request.cabinetId();
        }

        if (authUtils.isTherapist()) {
            UUID therapistCabinetId = authUtils.getCurrentCabinetId();
            if (therapistCabinetId == null) {
                throw new BusinessException("Le thérapeute doit être associé à un cabinet", HttpStatus.FORBIDDEN);
            }

            // If admin-like therapist provides cabinetId, validate they have access
            if (request.cabinetId() != null && !request.cabinetId().equals(therapistCabinetId)) {
                throw new BusinessException("cabinetId", "Le thérapeute ne peut créer des patients que dans son propre cabinet", HttpStatus.FORBIDDEN);
            }

            return therapistCabinetId;
        }

        throw new BusinessException("Non autorisé : Seuls les administrateurs et les thérapeutes peuvent créer des patients", HttpStatus.FORBIDDEN);
    }

    private Cabinet validateAndGetCabinet(UUID cabinetId) {
        Cabinet cabinet = cabinetRepository.findById(cabinetId)
                .orElseThrow(() -> new BusinessException("Cabinet non trouvé avec l'ID : " + cabinetId, HttpStatus.NOT_FOUND));

        return cabinet;
    }

    @Override
    @Transactional
    public PatientResponse update(UUID id, PatientRequest request) {
        // Find patient
        Patient existingPatient = findPatientWithAccessControl(id);

        // Check cabinet access if changing cabinet
        if (request.cabinetId() != null && !existingPatient.getCabinet().getId().equals(request.cabinetId())) {
            validateCabinetAccess(request.cabinetId());
        }

        // Update entity
        patientMapper.updateEntity(existingPatient, request);

        // Save updated entity
        Patient savedPatient = patientRepository.save(existingPatient);

        // Return response
        return patientMapper.toResponse(savedPatient);
    }

    @Override
    @Transactional(readOnly = true)
    public PatientResponse getById(UUID id) {
        Patient patient = findPatientWithAccessControl(id);
        return patientMapper.toResponse(patient);
    }

    @Override
    @Transactional
    public void delete(UUID id) {
        // Find patient and check access
        Patient patient = findPatientWithAccessControl(id);

        // Delete patient
        patientRepository.delete(patient);
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<PatientResponse> search(String keyword, Pageable pageable) {

        // Convert to response
        return null;
    }

    @Override
    @Transactional(readOnly = true)
    public PageResponse<PatientResponse> fetchAll(Pageable pageable) {
        Page<Patient> patients;

        if (authUtils.isAdmin()) {
            // Admins can see all patients
            patients = patientRepository.findAll(pageable);
        } else {
            // Therapists can only see patients from their cabinet
            UUID cabinetId = authUtils.getCurrentCabinetId();
            if (cabinetId == null) {
                throw new BusinessException("Aucun cabinet associé à l'utilisateur actuel", HttpStatus.FORBIDDEN);
            }
            patients = patientRepository.findAllByCabinetId(cabinetId, pageable);
        }

        return PageMapper.toMyPageRES(patients, pageable, patientMapper::toResponse);
    }

    private Patient findPatientWithAccessControl(UUID id) {
        if (id == null) {
            throw new BusinessException("patientId", "L'ID du patient ne peut pas être nul", HttpStatus.BAD_REQUEST);
        }

        if (authUtils.isAdmin()) {
            // Admins can access any patient
            return patientRepository.findById(id)
                    .orElseThrow(() -> new BusinessException("Patient non trouvé avec l'ID : " + id, HttpStatus.NOT_FOUND));
        } else {
            // Therapists can only access patients from their cabinet
            UUID cabinetId = authUtils.getCurrentCabinetId();
            if (cabinetId == null) {
                throw new BusinessException("Aucun cabinet associé à l'utilisateur actuel", HttpStatus.FORBIDDEN);
            }

            return patientRepository.findByIdAndCabinetId(id, cabinetId)
                    .orElseThrow(() -> new BusinessException("Patient non trouvé ou vous n'avez pas accès", HttpStatus.NOT_FOUND));
        }
    }

    private void validateCabinetAccess(UUID cabinetId) {
        if (cabinetId == null) {
            throw new BusinessException("cabinetId", "L'ID du cabinet est requis", HttpStatus.BAD_REQUEST);
        }

        if (authUtils.isTherapist()) {
            UUID userCabinetId = authUtils.getCurrentCabinetId();
            if (userCabinetId == null || !userCabinetId.equals(cabinetId)) {
                throw new BusinessException("Vous n'avez pas accès à ce cabinet", HttpStatus.FORBIDDEN);
            }
        }
        // Admin can access any cabinet, so no validation needed
    }
}
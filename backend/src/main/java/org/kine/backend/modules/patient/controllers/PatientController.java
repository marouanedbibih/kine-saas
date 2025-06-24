package org.kine.backend.modules.patient.controllers;

import org.kine.backend.modules.patient.http.PatientRequest;
import org.kine.backend.modules.patient.http.PatientResponse;
import org.kine.backend.modules.patient.services.IPatientService;
import org.kine.backend.utils.page.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import java.util.UUID;

/**
 * Contrôleur REST pour la gestion des patients.
 * 
 * Ce contrôleur expose les points d'accès HTTP pour toutes les opérations CRUD sur les patients,
 * avec un contrôle d'accès basé sur les rôles. Les fonctionnalités sont déléguées au service patient.
 * 
 * Points d'accès exposés :
 * - POST /api/v1/patients : Création d'un nouveau patient
 * - PUT /api/v1/patients/{id} : Mise à jour d'un patient existant
 * - GET /api/v1/patients/{id} : Récupération d'un patient par son ID
 * - GET /api/v1/patients : Récupération paginée de tous les patients (avec filtres optionnels)
 * - DELETE /api/v1/patients/{id} : Suppression d'un patient
 * 
 * Contrôle d'accès :
 * - Les administrateurs ont accès à tous les patients
 * - Les thérapeutes ne peuvent accéder qu'aux patients de leur cabinet
 * - Les annotations de sécurité garantissent que seuls les utilisateurs autorisés peuvent accéder aux endpoints
 * 
 * @author Système Kine SaaS
 * @version 1.0
 * @since 2025
 */
@RestController
@RequestMapping("/api/v1/patients")
@RequiredArgsConstructor
public class PatientController {

    private final IPatientService patientService;

    /**
     * Crée un nouveau patient.
     * 
     * @param request Les données du patient à créer
     * @return Le patient créé avec un code HTTP 201 (Created)
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'THERAPIST')")
    public ResponseEntity<PatientResponse> createPatient(@Valid @RequestBody PatientRequest request) {
        PatientResponse response = patientService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Met à jour un patient existant.
     * 
     * @param id L'identifiant du patient à mettre à jour
     * @param request Les nouvelles données du patient
     * @return Le patient mis à jour
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'THERAPIST')")
    public ResponseEntity<PatientResponse> updatePatient(@PathVariable UUID id, @Valid @RequestBody PatientRequest request) {
        PatientResponse response = patientService.update(id, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Récupère un patient par son identifiant.
     * 
     * @param id L'identifiant du patient à récupérer
     * @return Le patient trouvé
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'THERAPIST')")
    public ResponseEntity<PatientResponse> getPatientById(@PathVariable UUID id) {
        PatientResponse response = patientService.getById(id);
        return ResponseEntity.ok(response);
    }

    /**
     * Supprime un patient.
     * 
     * @param id L'identifiant du patient à supprimer
     * @return Réponse vide avec code HTTP 204 (No Content)
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'THERAPIST')")
    public ResponseEntity<Void> deletePatient(@PathVariable UUID id) {
        patientService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Récupère la liste paginée de tous les patients.
     * Si un mot-clé de recherche est fourni, effectue une recherche filtrée.
     * 
     * @param keyword Mot-clé de recherche optionnel
     * @param page Numéro de page (commence à 0), défaut : 0
     * @param size Taille de la page, défaut : 20
     * @param sortBy Champ de tri, défaut : "lastName"
     * @param sortDirection Direction du tri (ASC ou DESC), défaut : "ASC"
     * @return Liste paginée des patients
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'THERAPIST')")
    public ResponseEntity<PageResponse<PatientResponse>> getAllPatients(
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "email") String sortBy,
            @RequestParam(defaultValue = "DESC") String sortDirection) {

        // Créer l'objet Sort basé sur la direction
        Sort.Direction direction = Sort.Direction.fromString(sortDirection.toUpperCase());
        Sort sort = Sort.by(direction, sortBy);
        
        // Créer l'objet Pageable
        Pageable pageable = PageRequest.of(page - 1, size, sort);
        
        PageResponse<PatientResponse> patients;
        
        if (keyword != null && !keyword.trim().isEmpty()) {
            patients = patientService.search(keyword, pageable);
        } else {
            patients = patientService.fetchAll(pageable);
        }
        
        return ResponseEntity.ok(patients);
    }
}
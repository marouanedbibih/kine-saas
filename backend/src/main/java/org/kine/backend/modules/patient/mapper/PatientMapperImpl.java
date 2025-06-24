package org.kine.backend.modules.patient.mapper;


import org.kine.backend.modules.cabinet.Cabinet;
import org.kine.backend.modules.cabinet.CabinetRepository;
import org.kine.backend.modules.patient.Patient;
import org.kine.backend.modules.patient.http.PatientRequest;
import org.kine.backend.modules.patient.http.PatientResponse;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class PatientMapperImpl implements IPatientMapper {

    private final CabinetRepository cabinetRepository;

    @Override
    public Patient toEntity(PatientRequest request) {
        if (request == null) {
            return null;
        }
        
        Cabinet cabinet = null;
        if (request.cabinetId() != null) {
            cabinet = cabinetRepository.findById(request.cabinetId()).orElse(null);
        }

        return Patient.builder()
                .firstName(request.firstName())
                .middleName(request.middleName())
                .lastName(request.lastName())
                .dateOfBirth(request.dateOfBirth())
                .gender(request.gender())
                .address(request.address())
                .city(request.city())
                .state(request.state())
                .zipCode(request.zipCode())
                .phone(request.phone())
                .altPhone(request.altPhone())
                .email(request.email())
                .emergencyContactName(request.emergencyContactName())
                .emergencyContactPhone(request.emergencyContactPhone())
                .emergencyContactEmail(request.emergencyContactEmail())
                .emergencyContactRelation(request.emergencyContactRelation())
                .profilePhotoUrl(request.profilePhotoUrl())
                .cabinet(cabinet)
                .build();
    }

    @Override
    public void updateEntity(Patient entity, PatientRequest request) {
        if (entity == null || request == null) {
            return;
        }
        
        // Update fields if they are provided
        if (request.firstName() != null) {
            entity.setFirstName(request.firstName());
        }
        if (request.middleName() != null) {
            entity.setMiddleName(request.middleName());
        }
        if (request.lastName() != null) {
            entity.setLastName(request.lastName());
        }
        if (request.dateOfBirth() != null) {
            entity.setDateOfBirth(request.dateOfBirth());
        }
        if (request.gender() != null) {
            entity.setGender(request.gender());
        }
        if (request.address() != null) {
            entity.setAddress(request.address());
        }
        if (request.city() != null) {
            entity.setCity(request.city());
        }
        if (request.state() != null) {
            entity.setState(request.state());
        }
        if (request.zipCode() != null) {
            entity.setZipCode(request.zipCode());
        }
        if (request.phone() != null) {
            entity.setPhone(request.phone());
        }
        if (request.altPhone() != null) {
            entity.setAltPhone(request.altPhone());
        }
        if (request.email() != null) {
            entity.setEmail(request.email());
        }
        if (request.emergencyContactName() != null) {
            entity.setEmergencyContactName(request.emergencyContactName());
        }
        if (request.emergencyContactPhone() != null) {
            entity.setEmergencyContactPhone(request.emergencyContactPhone());
        }
        if (request.emergencyContactEmail() != null) {
            entity.setEmergencyContactEmail(request.emergencyContactEmail());
        }
        if (request.emergencyContactRelation() != null) {
            entity.setEmergencyContactRelation(request.emergencyContactRelation());
        }
        if (request.profilePhotoUrl() != null) {
            entity.setProfilePhotoUrl(request.profilePhotoUrl());
        }
        
        // Update cabinet if cabinetId is provided
        if (request.cabinetId() != null) {
            Cabinet cabinet = cabinetRepository.findById(request.cabinetId()).orElse(null);
            entity.setCabinet(cabinet);
        }
    }

    @Override
    public PatientResponse toResponse(Patient patient) {
        if (patient == null) {
            return null;
        }
        
        PatientResponse.CabinetInfo cabinetInfo = null;
        if (patient.getCabinet() != null) {
            cabinetInfo = new PatientResponse.CabinetInfo(
                    patient.getCabinet().getId(),
                    patient.getCabinet().getName()
            );
        }

        return PatientResponse.builder()
                .id(patient.getId())
                .firstName(patient.getFirstName())
                .middleName(patient.getMiddleName())
                .lastName(patient.getLastName())
                .dateOfBirth(patient.getDateOfBirth())
                .gender(patient.getGender())
                .address(patient.getAddress())
                .city(patient.getCity())
                .state(patient.getState())
                .zipCode(patient.getZipCode())
                .phone(patient.getPhone())
                .altPhone(patient.getAltPhone())
                .email(patient.getEmail())
                .emergencyContactName(patient.getEmergencyContactName())
                .emergencyContactPhone(patient.getEmergencyContactPhone())
                .emergencyContactEmail(patient.getEmergencyContactEmail())
                .emergencyContactRelation(patient.getEmergencyContactRelation())
                .profilePhotoUrl(patient.getProfilePhotoUrl())
                .cabinet(cabinetInfo)
                .build();
    }


    @Override
    public Patient toEntity(PatientRequest request, Cabinet cabinet) {
        if (request == null) {
            return null;
        }

        return Patient.builder()
                .firstName(request.firstName())
                .middleName(request.middleName())
                .lastName(request.lastName())
                .dateOfBirth(request.dateOfBirth())
                .gender(request.gender())
                .address(request.address())
                .city(request.city())
                .state(request.state())
                .zipCode(request.zipCode())
                .phone(request.phone())
                .altPhone(request.altPhone())
                .email(request.email())
                .emergencyContactName(request.emergencyContactName())
                .emergencyContactPhone(request.emergencyContactPhone())
                .emergencyContactEmail(request.emergencyContactEmail())
                .emergencyContactRelation(request.emergencyContactRelation())
                .profilePhotoUrl(request.profilePhotoUrl())
                .cabinet(cabinet)
                .build();
    }
}
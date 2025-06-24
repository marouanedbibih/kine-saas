package org.kine.backend.modules.patient.mapper;

import org.kine.backend.modules.cabinet.Cabinet;
import org.kine.backend.modules.patient.Patient;
import org.kine.backend.modules.patient.http.PatientRequest;
import org.kine.backend.modules.patient.http.PatientResponse;


public interface IPatientMapper {

    Patient toEntity(PatientRequest request);

    Patient toEntity(PatientRequest request, Cabinet cabinet);

    void updateEntity(Patient entity, PatientRequest request);
    
    PatientResponse toResponse(Patient patient);
}
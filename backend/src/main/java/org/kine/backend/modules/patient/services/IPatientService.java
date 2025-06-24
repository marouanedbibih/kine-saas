package org.kine.backend.modules.patient.services;


import org.kine.backend.modules.patient.http.PatientRequest;
import org.kine.backend.modules.patient.http.PatientResponse;
import org.kine.backend.utils.page.PageResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface IPatientService {
    
    PatientResponse create(PatientRequest request);
    
    PatientResponse update(UUID id, PatientRequest request);
    
    PatientResponse getById(UUID id);
    
    void delete(UUID id);
    
    PageResponse<PatientResponse> search(String keyword, Pageable pageable);
    
    PageResponse<PatientResponse> fetchAll(Pageable pageable);

}
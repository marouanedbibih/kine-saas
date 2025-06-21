package org.kine.backend.modules.medical_document;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.UUID;

import org.kine.backend.modules.patient.Patient;

@Entity
@Table(name = "medical_documents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MedicalDocument {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Column(nullable = false)
    private String fileUrl;

    @Column(nullable = false)
    private Date uploadedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private Patient patient;
    
}
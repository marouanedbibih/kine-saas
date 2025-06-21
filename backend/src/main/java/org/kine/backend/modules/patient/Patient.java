package org.kine.backend.modules.patient;


import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.kine.backend.enums.Gender;
import org.kine.backend.modules.cabinet.Cabinet;
import org.kine.backend.modules.medical_document.MedicalDocument;
import org.kine.backend.modules.session.Session;

@Entity
@Table(name = "patients")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Patient {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String firstName;

    private String middleName;

    @Column(nullable = false)
    private String lastName;

    private Date dateOfBirth;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String phone;
    private String altPhone;
    private String email;

    private String emergencyContactName;
    private String emergencyContactPhone;
    private String emergencyContactEmail;
    private String emergencyContactRelation;

    private String profilePhotoUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cabinet_id")
    private Cabinet cabinet;

    @OneToMany(mappedBy = "patient")
    private List<Session> sessions;

    @OneToMany(mappedBy = "patient")
    private List<MedicalDocument> medicalDocuments;

}
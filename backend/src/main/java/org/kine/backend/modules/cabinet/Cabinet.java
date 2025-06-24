package org.kine.backend.modules.cabinet;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;
import java.util.UUID;

import org.kine.backend.modules.patient.Patient;
import org.kine.backend.modules.therapist.Therapist;

@Entity
@Table(name = "cabinets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Cabinet {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private String name;

    private String address;
    private String city;
    private String phone;

    @OneToMany(mappedBy = "cabinet")
    private List<Patient> patients;

    @OneToMany(mappedBy = "cabinet")
    private List<Therapist> therapists;
}
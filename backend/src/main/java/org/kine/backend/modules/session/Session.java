package org.kine.backend.modules.session;

import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.util.UUID;

import org.kine.backend.modules.patient.Patient;
import org.kine.backend.modules.therapist.Therapist;

@Entity
@Table(name = "sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Session {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false)
    private Date date;

    @Column(length = 1000)
    private String notes;

    private int duration; // in minutes

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "therapist_id")
    private Therapist therapist;

    /**
     * Reschedule the session to a new date
     * 
     * @param newDate The new date for the session
     */
    public void reschedule(Date newDate) {
        this.date = newDate;
    }
}
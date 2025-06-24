package org.kine.backend.modules.therapist;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

import org.kine.backend.enums.UserRole;
import org.kine.backend.modules.cabinet.Cabinet;
import org.kine.backend.modules.session.Session;
import org.kine.backend.modules.user.User;

@Entity
@Table(name = "therapists")
@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
public class Therapist extends User {

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    private String phone;
    
    private String specialty;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cabinet_id")
    private Cabinet cabinet;

    @OneToMany(mappedBy = "therapist")
    private List<Session> sessions;

    public Therapist(String email, String password, String firstName, String lastName) {
        super(null, email, password, UserRole.THERAPIST, true, true, true, true);
        this.firstName = firstName;
        this.lastName = lastName;
    }
}
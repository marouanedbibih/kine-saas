package org.kine.backend.modules.admin;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import org.kine.backend.enums.UserRole;
import org.kine.backend.modules.user.User;

@Entity
@Table(name = "admins")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Admin extends User {

    @Column(nullable = false)
    private String fullName;

    public Admin(String email, String password, String fullName) {
        super(null, email, password, UserRole.ADMIN, true, true, true, true);
        this.fullName = fullName;
    }
}
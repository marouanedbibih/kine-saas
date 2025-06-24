package org.kine.backend.modules.patient.http;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.kine.backend.enums.Gender;

import java.util.Date;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PatientResponse {
    private UUID id;
    private String firstName;
    private String middleName;
    private String lastName;
    private String fullName;
    private Date dateOfBirth;
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
    private CabinetInfo cabinet;


    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class CabinetInfo {
        private UUID id;
        private String name;

    }
}
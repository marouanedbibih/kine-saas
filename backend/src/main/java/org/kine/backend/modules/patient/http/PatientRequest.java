package org.kine.backend.modules.patient.http;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;

import java.util.Date;
import java.util.UUID;

import org.kine.backend.enums.Gender;
import org.kine.backend.modules.patient.validation.OnCreate;
import org.kine.backend.modules.patient.validation.OnUpdate;

public record PatientRequest(
        @NotBlank(message = "First name is required", groups = {OnCreate.class, OnUpdate.class})
        String firstName,
        
        String middleName,
        
        @NotBlank(message = "Last name is required", groups = {OnCreate.class, OnUpdate.class})
        String lastName,
        
        @Past(message = "Date of birth must be in the past", groups = {OnCreate.class, OnUpdate.class})
        Date dateOfBirth,
        
        Gender gender,
        
        String address,
        
        String city,
        
        String state,
        
        @Pattern(regexp = "^\\d{5}(-\\d{4})?$", message = "Invalid zip code format", groups = {OnCreate.class, OnUpdate.class})
        String zipCode,
        
        @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Invalid phone number format", groups = {OnCreate.class, OnUpdate.class})
        String phone,
        
        @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Invalid alternative phone number format", groups = {OnCreate.class, OnUpdate.class})
        String altPhone,
        
        @Email(message = "Invalid email format", groups = {OnCreate.class, OnUpdate.class})
        String email,
        
        String emergencyContactName,
        
        @Pattern(regexp = "^\\+?[0-9]{10,15}$", message = "Invalid emergency contact phone format", groups = {OnCreate.class, OnUpdate.class})
        String emergencyContactPhone,
        
        @Email(message = "Invalid emergency contact email format", groups = {OnCreate.class, OnUpdate.class})
        String emergencyContactEmail,
        
        String emergencyContactRelation,
        
        String profilePhotoUrl,
        
        UUID cabinetId
) {
    // No additional methods needed for a record
}
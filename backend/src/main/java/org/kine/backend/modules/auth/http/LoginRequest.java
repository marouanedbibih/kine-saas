package org.kine.backend.modules.auth.http;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class LoginRequest {
    
    @NotBlank(message = "Email is required and cannot be empty")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Password is required and cannot be empty")
    private String password;
}

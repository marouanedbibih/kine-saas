package org.kine.backend.modules.user.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import com.fasterxml.jackson.annotation.JsonInclude;

import org.kine.backend.enums.UserRole;
import org.kine.backend.modules.user.User;


import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Base User Data Transfer Object
 * Contains common user information without sensitive data
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDTO {

    private UUID id;


    private String email;

    private UserRole role;

    private boolean accountNonExpired;
    private boolean accountNonLocked;
    private boolean credentialsNonExpired;
    private boolean enabled;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    /**
     * Create UserDTO from User entity
     * 
     * @param user the user entity
     * @return UserDTO
     */
    public static UserDTO fromEntity(User user) {
        if (user == null) {
            return null;
        }

        return UserDTO.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .accountNonExpired(user.isAccountNonExpired())
                .accountNonLocked(user.isAccountNonLocked())
                .credentialsNonExpired(user.isCredentialsNonExpired())
                .enabled(user.isEnabled())
                .build();
    }

}

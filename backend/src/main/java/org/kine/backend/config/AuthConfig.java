package org.kine.backend.config;

import org.kine.backend.modules.auth.services.AuthServiceImpl;
import org.kine.backend.modules.auth.services.IAuthService;
import org.kine.backend.modules.cabinet.CabinetRepository;
import org.kine.backend.security.jwt.JwtUtils;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;

@Configuration
public class AuthConfig {

    @Bean
    public IAuthService authService(AuthenticationManager authenticationManager, 
                                   JwtUtils jwtUtils, 
                                   CabinetRepository cabinetRepository) {
        return new AuthServiceImpl(
            authenticationManager,
            jwtUtils,
            cabinetRepository
        );
    }
    
}
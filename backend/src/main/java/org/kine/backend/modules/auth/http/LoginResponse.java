package org.kine.backend.modules.auth.http;


public record LoginResponse(
    String accessToken,
    String refreshToken
) {
    
}

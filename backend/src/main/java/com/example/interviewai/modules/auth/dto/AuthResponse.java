package com.example.interviewai.modules.auth.dto;

import com.example.interviewai.modules.user.dto.UserResponse;

public record AuthResponse(
        UserResponse user,
        String message
) {
}

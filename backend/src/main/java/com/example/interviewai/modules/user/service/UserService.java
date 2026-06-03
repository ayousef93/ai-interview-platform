package com.example.interviewai.modules.user.service;

import com.example.interviewai.modules.user.dto.UserResponse;
import com.example.interviewai.modules.user.model.User;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    public UserResponse toResponse(User user) {
        return UserResponse.from(user);
    }
}

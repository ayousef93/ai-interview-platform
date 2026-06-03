package com.example.interviewai.common;

import com.example.interviewai.exception.UnauthorizedException;
import com.example.interviewai.modules.user.model.User;
import com.example.interviewai.modules.user.repository.UserRepository;
import com.example.interviewai.security.AppUserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class CurrentUser {

    private final UserRepository userRepository;

    public User get() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof AppUserPrincipal principal)) {
            throw new UnauthorizedException("Authentication required");
        }
        return userRepository.findById(principal.getId())
                .orElseThrow(() -> new UnauthorizedException("Authenticated user no longer exists"));
    }
}

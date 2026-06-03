package com.example.interviewai.modules.auth.service;

import com.example.interviewai.exception.ConflictException;
import com.example.interviewai.modules.auth.dto.AuthResponse;
import com.example.interviewai.modules.auth.dto.LoginRequest;
import com.example.interviewai.modules.auth.dto.RegisterRequest;
import com.example.interviewai.modules.user.dto.UserResponse;
import com.example.interviewai.modules.user.model.User;
import com.example.interviewai.modules.user.model.UserRole;
import com.example.interviewai.modules.user.repository.UserRepository;
import com.example.interviewai.security.AppUserPrincipal;
import com.example.interviewai.security.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;

@Service
@RequiredArgsConstructor
public class AuthService {

    private static final String ACCESS_TOKEN_COOKIE = "access_token";

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    @Transactional
    public AuthResponse register(RegisterRequest request, HttpServletResponse response) {
        if (userRepository.existsByEmailIgnoreCase(request.email())) {
            throw new ConflictException("Email is already registered");
        }
        User user = User.builder()
                .fullName(request.fullName().trim())
                .email(request.email().trim().toLowerCase())
                .password(passwordEncoder.encode(request.password()))
                .role(UserRole.USER)
                .active(true)
                .build();
        User saved = userRepository.save(user);
        setJwtCookie(response, jwtService.generateToken(new AppUserPrincipal(saved)));
        return new AuthResponse(UserResponse.from(saved), "Registration successful");
    }

    public AuthResponse login(LoginRequest request, HttpServletResponse response) {
        var authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        AppUserPrincipal principal = (AppUserPrincipal) authentication.getPrincipal();
        String jwt = jwtService.generateToken(principal);
        setJwtCookie(response, jwt);
        User user = userRepository.findById(principal.getId()).orElseThrow();
        return new AuthResponse(UserResponse.from(user), "Login successful");
    }

    public void logout(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(ACCESS_TOKEN_COOKIE, "")
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ZERO)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void setJwtCookie(HttpServletResponse response, String jwt) {
        ResponseCookie cookie = ResponseCookie.from(ACCESS_TOKEN_COOKIE, jwt)
                .httpOnly(true)
                .secure(false)
                .sameSite("Lax")
                .path("/")
                .maxAge(Duration.ofMillis(jwtExpirationMs))
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}

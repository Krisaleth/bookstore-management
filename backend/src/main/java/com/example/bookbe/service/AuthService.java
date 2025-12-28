package com.example.bookbe.service;

import com.example.bookbe.dto.AuthResponse;
import com.example.bookbe.dto.LoginRequest;
import com.example.bookbe.dto.RegisterRequest;
import com.example.bookbe.dto.UserDto;
import com.example.bookbe.entity.User;
import com.example.bookbe.repository.UserRepository;
import com.example.bookbe.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        UserDto userDto = userService.createUser(request);
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found after creation"));

        String token = jwtTokenProvider.generateToken(user.getUsername());
        return new AuthResponse(token, "Bearer", userDto);
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtTokenProvider.generateToken(user.getUsername());
        UserDto userDto = userService.getUserById(user.getId());

        return new AuthResponse(token, "Bearer", userDto);
    }
}


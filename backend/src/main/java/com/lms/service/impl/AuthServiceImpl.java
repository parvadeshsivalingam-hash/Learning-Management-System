package com.lms.service.impl;

import com.lms.dto.AuthRequest;
import com.lms.dto.AuthResponse;
import com.lms.dto.RegisterRequest;
import com.lms.dto.UserDto;
import com.lms.entity.Role;
import com.lms.entity.User;
import com.lms.entity.UserStatus;
import com.lms.exception.BadRequestException;
import com.lms.exception.DuplicateResourceException;
import com.lms.exception.ResourceNotFoundException;
import com.lms.repository.UserRepository;
import com.lms.security.JwtTokenProvider;
import com.lms.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final AuthenticationManager authenticationManager;

    @Override
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered: " + request.getEmail());
        }

        Role role = request.getRole() != null ? request.getRole() : Role.STUDENT;

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .status(UserStatus.ACTIVE)
                .profileImage("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150")
                .build();

        User savedUser = userRepository.save(user);
        String token = tokenProvider.generateTokenFromEmail(savedUser.getEmail());

        return AuthResponse.builder()
                .token(token)
                .user(mapToUserDto(savedUser))
                .build();
    }

    @Override
    public AuthResponse login(AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        if (user.getStatus() == UserStatus.INACTIVE) {
            throw new BadRequestException("Account is deactivated. Please contact support.");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail().toLowerCase(), request.getPassword())
            );

            String token = tokenProvider.generateToken(authentication);

            return AuthResponse.builder()
                    .token(token)
                    .user(mapToUserDto(user))
                    .build();
        } catch (Exception e) {
            throw new BadRequestException("Invalid email or password");
        }
    }

    @Override
    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToUserDto(user);
    }

    private UserDto mapToUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .profileImage(user.getProfileImage())
                .status(user.getStatus())
                .createdAt(user.getCreatedAt())
                .build();
    }
}

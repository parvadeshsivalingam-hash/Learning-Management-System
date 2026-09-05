package com.lms;

import com.lms.dto.AuthRequest;
import com.lms.dto.AuthResponse;
import com.lms.dto.RegisterRequest;
import com.lms.entity.Role;
import com.lms.entity.User;
import com.lms.entity.UserStatus;
import com.lms.exception.DuplicateResourceException;
import com.lms.repository.UserRepository;
import com.lms.security.JwtTokenProvider;
import com.lms.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleUser;

    @BeforeEach
    void setUp() {
        sampleUser = User.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .password("encoded_pass")
                .role(Role.STUDENT)
                .status(UserStatus.ACTIVE)
                .build();
    }

    @Test
    void testRegisterSuccess() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Test User");
        request.setEmail("test@example.com");
        request.setPassword("password123");
        request.setRole(Role.STUDENT);

        when(userRepository.existsByEmail("test@example.com")).thenReturn(false);
        when(passwordEncoder.encode("password123")).thenReturn("encoded_pass");
        when(userRepository.save(any(User.class))).thenReturn(sampleUser);
        when(tokenProvider.generateTokenFromEmail("test@example.com")).thenReturn("dummy_jwt_token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("dummy_jwt_token", response.getToken());
        assertEquals("test@example.com", response.getUser().getEmail());
        verify(userRepository, times(1)).save(any(User.class));
    }

    @Test
    void testRegisterDuplicateEmailThrowsException() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");

        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(request));
    }

    @Test
    void testLoginSuccess() {
        AuthRequest request = new AuthRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");

        Authentication auth = mock(Authentication.class);

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(sampleUser));
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(auth);
        when(tokenProvider.generateToken(auth)).thenReturn("dummy_jwt_token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("dummy_jwt_token", response.getToken());
        assertEquals("test@example.com", response.getUser().getEmail());
    }
}

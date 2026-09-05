package com.lms.service;

import com.lms.dto.AuthRequest;
import com.lms.dto.AuthResponse;
import com.lms.dto.RegisterRequest;
import com.lms.dto.UserDto;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(AuthRequest request);
    UserDto getCurrentUser(String email);
}

package com.lms.service.impl;

import com.lms.dto.UserDto;
import com.lms.entity.Role;
import com.lms.entity.User;
import com.lms.entity.UserStatus;
import com.lms.exception.DuplicateResourceException;
import com.lms.exception.ResourceNotFoundException;
import com.lms.repository.UserRepository;
import com.lms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<UserDto> getUsers(Role role, Pageable pageable) {
        if (role != null) {
            return userRepository.findByRole(role, pageable).map(this::mapToDto);
        }
        return userRepository.findAll(pageable).map(this::mapToDto);
    }

    @Override
    public UserDto getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToDto(user);
    }

    @Override
    public UserDto createUser(UserDto userDto, String password) {
        if (userRepository.existsByEmail(userDto.getEmail())) {
            throw new DuplicateResourceException("User already exists with email: " + userDto.getEmail());
        }
        User user = User.builder()
                .name(userDto.getName())
                .email(userDto.getEmail().toLowerCase())
                .password(passwordEncoder.encode(password != null ? password : "password123"))
                .role(userDto.getRole() != null ? userDto.getRole() : Role.STUDENT)
                .status(UserStatus.ACTIVE)
                .profileImage(userDto.getProfileImage())
                .build();
        return mapToDto(userRepository.save(user));
    }

    @Override
    public UserDto updateUser(Long id, UserDto userDto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setName(userDto.getName());
        if (userDto.getRole() != null) {
            user.setRole(userDto.getRole());
        }
        if (userDto.getProfileImage() != null) {
            user.setProfileImage(userDto.getProfileImage());
        }
        return mapToDto(userRepository.save(user));
    }

    @Override
    public UserDto toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setStatus(user.getStatus() == UserStatus.ACTIVE ? UserStatus.INACTIVE : UserStatus.ACTIVE);
        return mapToDto(userRepository.save(user));
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }

    private UserDto mapToDto(User user) {
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

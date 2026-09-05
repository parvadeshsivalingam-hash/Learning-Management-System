package com.lms.service;

import com.lms.dto.UserDto;
import com.lms.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    List<UserDto> getAllUsers();
    Page<UserDto> getUsers(Role role, Pageable pageable);
    UserDto getUserById(Long id);
    UserDto createUser(UserDto userDto, String password);
    UserDto updateUser(Long id, UserDto userDto);
    UserDto toggleUserStatus(Long id);
    void deleteUser(Long id);
}

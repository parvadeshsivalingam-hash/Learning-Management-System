package com.lms.dto;

import com.lms.entity.Role;
import com.lms.entity.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String profileImage;
    private UserStatus status;
    private LocalDateTime createdAt;
}

package com.lms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssignmentDto {
    private Long id;

    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotBlank(message = "Assignment title is required")
    private String title;

    private String description;
    private LocalDateTime dueDate;

    @NotNull(message = "Maximum marks is required")
    private Integer maxMarks;
}

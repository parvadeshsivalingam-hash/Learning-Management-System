package com.lms.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SubmissionGradeRequest {
    @NotNull(message = "Marks are required")
    @Min(value = 0, message = "Marks cannot be negative")
    private Integer marks;

    private String feedback;
}

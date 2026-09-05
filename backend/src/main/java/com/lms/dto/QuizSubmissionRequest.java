package com.lms.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Map;

@Data
public class QuizSubmissionRequest {
    @NotNull(message = "Quiz ID is required")
    private Long quizId;

    // Map of questionId -> selectedAnswerId
    private Map<Long, Long> answers;
}

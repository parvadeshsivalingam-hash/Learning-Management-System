package com.lms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizAttemptDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long quizId;
    private String quizTitle;
    private Integer score;
    private Integer totalQuestions;
    private boolean passed;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
}

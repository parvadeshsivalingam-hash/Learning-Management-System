package com.lms.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QuizDto {
    private Long id;

    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotBlank(message = "Quiz title is required")
    private String title;

    private String description;

    @NotNull(message = "Time limit is required")
    private Integer timeLimit;

    private int questionsCount;

    @Builder.Default
    private List<QuestionDto> questions = new ArrayList<>();
}

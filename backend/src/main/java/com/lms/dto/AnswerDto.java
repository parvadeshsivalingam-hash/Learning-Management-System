package com.lms.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnswerDto {
    private Long id;
    private Long questionId;

    @NotBlank(message = "Answer text is required")
    private String answerText;

    private boolean isCorrect;
}

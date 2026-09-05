package com.lms.dto;

import jakarta.validation.constraints.NotBlank;
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
public class QuestionDto {
    private Long id;
    private Long quizId;

    @NotBlank(message = "Question text is required")
    private String questionText;

    @Builder.Default
    private List<AnswerDto> answers = new ArrayList<>();
}

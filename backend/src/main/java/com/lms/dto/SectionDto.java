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
public class SectionDto {
    private Long id;
    private Long courseId;

    @NotBlank(message = "Section title is required")
    private String title;

    private String description;
    private Integer orderIndex;

    @Builder.Default
    private List<LessonDto> lessons = new ArrayList<>();
}

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
public class LessonDto {
    private Long id;
    private Long sectionId;

    @NotBlank(message = "Lesson title is required")
    private String title;

    private String description;
    private String videoUrl;
    private Integer duration;
    private String resourceUrl;
    private Integer orderIndex;
    private boolean completed;
}

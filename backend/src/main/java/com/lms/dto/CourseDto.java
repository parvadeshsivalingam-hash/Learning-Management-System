package com.lms.dto;

import com.lms.entity.CourseLevel;
import com.lms.entity.CourseStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CourseDto {
    private Long id;

    @NotBlank(message = "Course title is required")
    private String title;

    private String description;
    private String thumbnail;
    private Double price;

    @NotNull(message = "Course level is required")
    private CourseLevel level;

    private Long categoryId;
    private String categoryName;

    private Long instructorId;
    private String instructorName;

    private CourseStatus status;
    private LocalDateTime createdAt;

    private Long enrolledCount;
    private Integer sectionsCount;
    private Integer lessonsCount;

    private List<SectionDto> sections;
}

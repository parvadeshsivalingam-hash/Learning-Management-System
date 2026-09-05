package com.lms.dto;

import com.lms.entity.EnrollmentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentDto {
    private Long id;
    private Long studentId;
    private String studentName;
    private String studentEmail;

    private Long courseId;
    private String courseTitle;
    private String courseThumbnail;

    private LocalDateTime enrolledAt;
    private EnrollmentStatus status;

    private long completedLessons;
    private long totalLessons;
    private int progressPercentage;
}

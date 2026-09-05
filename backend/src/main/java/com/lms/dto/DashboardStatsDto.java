package com.lms.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    // Admin stats
    private Long totalUsers;
    private Long totalStudents;
    private Long totalInstructors;
    private Long totalCourses;
    private Long totalEnrollments;
    private Long activeUsers;

    // Instructor stats
    private Long instructorCourses;
    private Long instructorStudents;
    private Long instructorLessons;
    private Double averageRating;

    // Student stats
    private Long enrolledCourses;
    private Long completedCourses;
    private Integer averageProgress;
    private Double quizAverageScore;

    // Lists for dashboard previews
    private List<CourseDto> recentCourses;
    private List<EnrollmentDto> recentEnrollments;
    private List<SubmissionDto> pendingSubmissions;
}

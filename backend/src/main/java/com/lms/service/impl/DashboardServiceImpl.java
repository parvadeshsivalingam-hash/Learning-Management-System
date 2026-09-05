package com.lms.service.impl;

import com.lms.dto.DashboardStatsDto;
import com.lms.entity.*;
import com.lms.exception.ResourceNotFoundException;
import com.lms.repository.*;
import com.lms.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository lessonProgressRepository;
    private final QuizAttemptRepository quizAttemptRepository;

    @Override
    public DashboardStatsDto getAdminStats() {
        long totalUsers = userRepository.count();
        long totalStudents = userRepository.countByRole(Role.STUDENT);
        long totalInstructors = userRepository.countByRole(Role.INSTRUCTOR);
        long totalCourses = courseRepository.count();
        long totalEnrollments = enrollmentRepository.count();
        long activeUsers = userRepository.countByStatus(UserStatus.ACTIVE);

        return DashboardStatsDto.builder()
                .totalUsers(totalUsers)
                .totalStudents(totalStudents)
                .totalInstructors(totalInstructors)
                .totalCourses(totalCourses)
                .totalEnrollments(totalEnrollments)
                .activeUsers(activeUsers)
                .build();
    }

    @Override
    public DashboardStatsDto getInstructorStats(String instructorEmail) {
        User instructor = userRepository.findByEmail(instructorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found"));

        List<Course> courses = courseRepository.findByInstructorId(instructor.getId());
        long totalStudents = 0;
        long totalLessons = 0;

        for (Course course : courses) {
            totalStudents += enrollmentRepository.countByCourseId(course.getId());
            totalLessons += lessonRepository.countByCourseId(course.getId());
        }

        return DashboardStatsDto.builder()
                .instructorCourses((long) courses.size())
                .instructorStudents(totalStudents)
                .instructorLessons(totalLessons)
                .averageRating(4.8)
                .build();
    }

    @Override
    public DashboardStatsDto getStudentStats(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        long enrolled = enrollmentRepository.countByStudentId(student.getId());
        long completed = enrollmentRepository.countByStudentIdAndStatus(student.getId(), EnrollmentStatus.COMPLETED);

        List<QuizAttempt> attempts = quizAttemptRepository.findByStudentId(student.getId());
        double quizAvg = attempts.isEmpty() ? 0.0 :
                attempts.stream().mapToInt(a -> (a.getScore() * 100) / (a.getTotalQuestions() > 0 ? a.getTotalQuestions() : 1)).average().orElse(0.0);

        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(student.getId());
        int totalProgressSum = 0;
        for (Enrollment e : enrollments) {
            long totalL = lessonRepository.countByCourseId(e.getCourse().getId());
            long compL = lessonProgressRepository.countCompletedLessonsByStudentAndCourse(student.getId(), e.getCourse().getId());
            if (totalL > 0) {
                totalProgressSum += (int) ((compL * 100) / totalL);
            }
        }
        int avgProgress = enrollments.isEmpty() ? 0 : totalProgressSum / enrollments.size();

        return DashboardStatsDto.builder()
                .enrolledCourses(enrolled)
                .completedCourses(completed)
                .averageProgress(avgProgress)
                .quizAverageScore(Math.round(quizAvg * 10.0) / 10.0)
                .build();
    }
}

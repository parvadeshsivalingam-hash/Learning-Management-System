package com.lms.service.impl;

import com.lms.dto.EnrollmentDto;
import com.lms.entity.Course;
import com.lms.entity.Enrollment;
import com.lms.entity.EnrollmentStatus;
import com.lms.entity.User;
import com.lms.exception.DuplicateResourceException;
import com.lms.exception.ResourceNotFoundException;
import com.lms.repository.*;
import com.lms.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository lessonProgressRepository;

    @Override
    public EnrollmentDto enrollStudent(Long courseId, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        if (enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), course.getId())) {
            throw new DuplicateResourceException("Already enrolled in this course");
        }

        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course)
                .status(EnrollmentStatus.ACTIVE)
                .build();

        return mapToDto(enrollmentRepository.save(enrollment));
    }

    @Override
    public List<EnrollmentDto> getStudentCourses(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        return enrollmentRepository.findByStudentId(student.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<EnrollmentDto> getCourseEnrollments(Long courseId) {
        return enrollmentRepository.findByCourseId(courseId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public void cancelEnrollment(Long enrollmentId, String studentEmail) {
        Enrollment enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Enrollment not found"));

        if (!enrollment.getStudent().getEmail().equalsIgnoreCase(studentEmail)) {
            throw new ResourceNotFoundException("Enrollment not found for current user");
        }

        enrollment.setStatus(EnrollmentStatus.CANCELLED);
        enrollmentRepository.save(enrollment);
    }

    @Override
    public boolean isStudentEnrolled(Long courseId, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail).orElse(null);
        if (student == null) return false;
        return enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), courseId);
    }

    private EnrollmentDto mapToDto(Enrollment enrollment) {
        Long studentId = enrollment.getStudent().getId();
        Long courseId = enrollment.getCourse().getId();

        long totalLessons = lessonRepository.countByCourseId(courseId);
        long completedLessons = lessonProgressRepository.countCompletedLessonsByStudentAndCourse(studentId, courseId);
        int percentage = totalLessons > 0 ? (int) ((completedLessons * 100) / totalLessons) : 0;

        return EnrollmentDto.builder()
                .id(enrollment.getId())
                .studentId(studentId)
                .studentName(enrollment.getStudent().getName())
                .studentEmail(enrollment.getStudent().getEmail())
                .courseId(courseId)
                .courseTitle(enrollment.getCourse().getTitle())
                .courseThumbnail(enrollment.getCourse().getThumbnail())
                .enrolledAt(enrollment.getEnrolledAt())
                .status(enrollment.getStatus())
                .totalLessons(totalLessons)
                .completedLessons(completedLessons)
                .progressPercentage(percentage)
                .build();
    }
}

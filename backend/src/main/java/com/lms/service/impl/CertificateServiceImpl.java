package com.lms.service.impl;

import com.lms.dto.CertificateDto;
import com.lms.entity.Certificate;
import com.lms.entity.Course;
import com.lms.entity.EnrollmentStatus;
import com.lms.entity.User;
import com.lms.exception.BadRequestException;
import com.lms.exception.ResourceNotFoundException;
import com.lms.repository.*;
import com.lms.service.CertificateService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CertificateServiceImpl implements CertificateService {

    private final CertificateRepository certificateRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final LessonRepository lessonRepository;
    private final LessonProgressRepository lessonProgressRepository;

    @Override
    public CertificateDto generateCertificate(Long courseId, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        if (!enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), course.getId())) {
            throw new BadRequestException("You must be enrolled in this course to claim a certificate.");
        }

        long totalLessons = lessonRepository.countByCourseId(courseId);
        long completedLessons = lessonProgressRepository.countCompletedLessonsByStudentAndCourse(student.getId(), courseId);

        if (totalLessons > 0 && completedLessons < totalLessons) {
            throw new BadRequestException("You must complete all " + totalLessons + " lessons to earn your certificate.");
        }

        Optional<Certificate> existing = certificateRepository.findByStudentIdAndCourseId(student.getId(), course.getId());
        if (existing.isPresent()) {
            return mapToDto(existing.get());
        }

        // Update enrollment status to COMPLETED
        enrollmentRepository.findByStudentIdAndCourseId(student.getId(), course.getId()).ifPresent(e -> {
            e.setStatus(EnrollmentStatus.COMPLETED);
            enrollmentRepository.save(e);
        });

        String certNum = "CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Certificate cert = Certificate.builder()
                .student(student)
                .course(course)
                .certificateNumber(certNum)
                .issuedAt(LocalDateTime.now())
                .build();

        return mapToDto(certificateRepository.save(cert));
    }

    @Override
    public List<CertificateDto> getStudentCertificates(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        return certificateRepository.findByStudentId(student.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public CertificateDto getCertificateByNumber(String certificateNumber) {
        Certificate cert = certificateRepository.findByCertificateNumber(certificateNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Certificate not found with number: " + certificateNumber));
        return mapToDto(cert);
    }

    private CertificateDto mapToDto(Certificate cert) {
        return CertificateDto.builder()
                .id(cert.getId())
                .studentId(cert.getStudent().getId())
                .studentName(cert.getStudent().getName())
                .courseId(cert.getCourse().getId())
                .courseTitle(cert.getCourse().getTitle())
                .instructorName(cert.getCourse().getInstructor() != null ? cert.getCourse().getInstructor().getName() : "Instructor")
                .certificateNumber(cert.getCertificateNumber())
                .issuedAt(cert.getIssuedAt())
                .build();
    }
}

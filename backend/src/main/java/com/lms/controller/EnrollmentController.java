package com.lms.controller;

import com.lms.dto.ApiResponse;
import com.lms.dto.EnrollmentDto;
import com.lms.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    @PostMapping("/api/enrollments")
    @PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<EnrollmentDto>> enrollStudent(@RequestBody Map<String, Long> payload, Authentication authentication) {
        Long courseId = payload.get("courseId");
        EnrollmentDto enrolled = enrollmentService.enrollStudent(courseId, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Enrolled successfully", enrolled));
    }

    @GetMapping("/api/enrollments/my-courses")
    @PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<EnrollmentDto>>> getMyCourses(Authentication authentication) {
        List<EnrollmentDto> courses = enrollmentService.getStudentCourses(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Enrolled courses retrieved", courses));
    }

    @GetMapping("/api/enrollments/course/{courseId}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<EnrollmentDto>>> getCourseEnrollments(@PathVariable Long courseId) {
        return ResponseEntity.ok(ApiResponse.success("Course enrollments retrieved", enrollmentService.getCourseEnrollments(courseId)));
    }

    @GetMapping("/api/enrollments/check/{courseId}")
    public ResponseEntity<ApiResponse<Boolean>> checkEnrollment(@PathVariable Long courseId, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.ok(ApiResponse.success("Enrollment status checked", false));
        }
        boolean enrolled = enrollmentService.isStudentEnrolled(courseId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Enrollment status checked", enrolled));
    }

    @DeleteMapping("/api/enrollments/{id}")
    @PreAuthorize("hasAnyRole('STUDENT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> cancelEnrollment(@PathVariable Long id, Authentication authentication) {
        enrollmentService.cancelEnrollment(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Enrollment cancelled"));
    }
}

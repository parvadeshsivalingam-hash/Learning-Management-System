package com.lms.service;

import com.lms.dto.EnrollmentDto;

import java.util.List;

public interface EnrollmentService {
    EnrollmentDto enrollStudent(Long courseId, String studentEmail);
    List<EnrollmentDto> getStudentCourses(String studentEmail);
    List<EnrollmentDto> getCourseEnrollments(Long courseId);
    void cancelEnrollment(Long enrollmentId, String studentEmail);
    boolean isStudentEnrolled(Long courseId, String studentEmail);
}

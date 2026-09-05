package com.lms.repository;

import com.lms.entity.Enrollment;
import com.lms.entity.EnrollmentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {
    List<Enrollment> findByStudentId(Long studentId);
    Page<Enrollment> findByStudentId(Long studentId, Pageable pageable);
    List<Enrollment> findByCourseId(Long courseId);
    Optional<Enrollment> findByStudentIdAndCourseId(Long studentId, Long courseId);
    boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);
    long countByStudentId(Long studentId);
    long countByCourseId(Long courseId);
    long countByStudentIdAndStatus(Long studentId, EnrollmentStatus status);
}

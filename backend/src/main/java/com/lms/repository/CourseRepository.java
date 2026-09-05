package com.lms.repository;

import com.lms.entity.Course;
import com.lms.entity.CourseLevel;
import com.lms.entity.CourseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {

    List<Course> findByInstructorId(Long instructorId);

    Page<Course> findByInstructorId(Long instructorId, Pageable pageable);

    long countByInstructorId(Long instructorId);

    long countByStatus(CourseStatus status);

    @Query("SELECT c FROM Course c WHERE " +
           "(:status IS NULL OR c.status = :status) AND " +
           "(:search IS NULL OR LOWER(c.title) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:categoryId IS NULL OR c.category.id = :categoryId) AND " +
           "(:level IS NULL OR c.level = :level)")
    Page<Course> searchCourses(
            @Param("status") CourseStatus status,
            @Param("search") String search,
            @Param("categoryId") Long categoryId,
            @Param("level") CourseLevel level,
            Pageable pageable
    );
}

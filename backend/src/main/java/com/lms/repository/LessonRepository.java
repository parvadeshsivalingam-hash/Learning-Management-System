package com.lms.repository;

import com.lms.entity.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    List<Lesson> findBySectionIdOrderByOrderIndexAsc(Long sectionId);

    @Query("SELECT l FROM Lesson l WHERE l.section.course.id = :courseId ORDER BY l.section.orderIndex ASC, l.orderIndex ASC")
    List<Lesson> findByCourseId(@Param("courseId") Long courseId);

    @Query("SELECT COUNT(l) FROM Lesson l WHERE l.section.course.id = :courseId")
    long countByCourseId(@Param("courseId") Long courseId);
}

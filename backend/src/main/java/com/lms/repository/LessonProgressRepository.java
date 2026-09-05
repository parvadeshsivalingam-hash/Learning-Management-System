package com.lms.repository;

import com.lms.entity.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {
    Optional<LessonProgress> findByStudentIdAndLessonId(Long studentId, Long lessonId);
    List<LessonProgress> findByStudentId(Long studentId);

    @Query("SELECT lp FROM LessonProgress lp WHERE lp.student.id = :studentId AND lp.lesson.section.course.id = :courseId")
    List<LessonProgress> findByStudentIdAndCourseId(@Param("studentId") Long studentId, @Param("courseId") Long courseId);

    @Query("SELECT COUNT(lp) FROM LessonProgress lp WHERE lp.student.id = :studentId AND lp.lesson.section.course.id = :courseId AND lp.completed = true")
    long countCompletedLessonsByStudentAndCourse(@Param("studentId") Long studentId, @Param("courseId") Long courseId);
}

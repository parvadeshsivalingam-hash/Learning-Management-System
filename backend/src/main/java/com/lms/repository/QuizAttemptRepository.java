package com.lms.repository;

import com.lms.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    List<QuizAttempt> findByStudentId(Long studentId);
    List<QuizAttempt> findByStudentIdAndQuizId(Long studentId, Long quizId);
    List<QuizAttempt> findByQuizId(Long quizId);
}

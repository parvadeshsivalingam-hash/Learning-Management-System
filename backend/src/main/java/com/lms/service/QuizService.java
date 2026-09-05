package com.lms.service;

import com.lms.dto.QuizAttemptDto;
import com.lms.dto.QuizDto;
import com.lms.dto.QuizSubmissionRequest;

import java.util.List;

public interface QuizService {
    List<QuizDto> getQuizzesByCourseId(Long courseId);
    QuizDto getQuizById(Long quizId);
    QuizDto createQuiz(QuizDto quizDto);
    QuizDto updateQuiz(Long quizId, QuizDto quizDto);
    void deleteQuiz(Long quizId);
    QuizAttemptDto submitQuiz(QuizSubmissionRequest request, String studentEmail);
    List<QuizAttemptDto> getStudentQuizAttempts(String studentEmail);
}

package com.lms.controller;

import com.lms.dto.*;
import com.lms.service.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @GetMapping("/api/courses/{courseId}/quizzes")
    public ResponseEntity<ApiResponse<List<QuizDto>>> getQuizzesByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(ApiResponse.success("Quizzes retrieved", quizService.getQuizzesByCourseId(courseId)));
    }

    @GetMapping("/api/quizzes/{id}")
    public ResponseEntity<ApiResponse<QuizDto>> getQuizById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Quiz details retrieved", quizService.getQuizById(id)));
    }

    @PostMapping("/api/instructor/quizzes")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<QuizDto>> createQuiz(@Valid @RequestBody QuizDto quizDto) {
        QuizDto created = quizService.createQuiz(quizDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Quiz created successfully", created));
    }

    @PutMapping("/api/instructor/quizzes/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<QuizDto>> updateQuiz(@PathVariable Long id, @Valid @RequestBody QuizDto quizDto) {
        return ResponseEntity.ok(ApiResponse.success("Quiz updated successfully", quizService.updateQuiz(id, quizDto)));
    }

    @DeleteMapping("/api/instructor/quizzes/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteQuiz(@PathVariable Long id) {
        quizService.deleteQuiz(id);
        return ResponseEntity.ok(ApiResponse.success("Quiz deleted successfully"));
    }

    @PostMapping("/api/student/quizzes/submit")
    @PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<QuizAttemptDto>> submitQuiz(@Valid @RequestBody QuizSubmissionRequest request, Authentication authentication) {
        QuizAttemptDto result = quizService.submitQuiz(request, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Quiz submitted successfully", result));
    }

    @GetMapping("/api/student/quizzes/attempts")
    @PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<QuizAttemptDto>>> getQuizAttempts(Authentication authentication) {
        List<QuizAttemptDto> attempts = quizService.getStudentQuizAttempts(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Quiz attempts retrieved", attempts));
    }
}

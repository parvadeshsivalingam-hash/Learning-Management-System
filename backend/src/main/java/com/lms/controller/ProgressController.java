package com.lms.controller;

import com.lms.dto.ApiResponse;
import com.lms.dto.LessonProgressDto;
import com.lms.service.LessonProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student/progress")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')")
public class ProgressController {

    private final LessonProgressService lessonProgressService;

    @PostMapping("/lessons/{lessonId}")
    public ResponseEntity<ApiResponse<LessonProgressDto>> toggleLessonProgress(
            @PathVariable Long lessonId,
            @RequestBody Map<String, Boolean> body,
            Authentication authentication
    ) {
        boolean completed = body.getOrDefault("completed", true);
        LessonProgressDto dto = lessonProgressService.toggleLessonCompletion(lessonId, authentication.getName(), completed);
        return ResponseEntity.ok(ApiResponse.success("Lesson progress updated", dto));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<ApiResponse<List<LessonProgressDto>>> getCourseProgress(@PathVariable Long courseId, Authentication authentication) {
        List<LessonProgressDto> list = lessonProgressService.getStudentProgress(courseId, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Course progress retrieved", list));
    }
}

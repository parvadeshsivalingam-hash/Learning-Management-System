package com.lms.controller;

import com.lms.dto.ApiResponse;
import com.lms.dto.LessonDto;
import com.lms.service.LessonService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;

    @GetMapping("/api/sections/{sectionId}/lessons")
    public ResponseEntity<ApiResponse<List<LessonDto>>> getLessonsBySection(@PathVariable Long sectionId) {
        return ResponseEntity.ok(ApiResponse.success("Lessons retrieved", lessonService.getLessonsBySectionId(sectionId)));
    }

    @GetMapping("/api/lessons/{id}")
    public ResponseEntity<ApiResponse<LessonDto>> getLessonById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Lesson found", lessonService.getLessonById(id)));
    }

    @PostMapping("/api/instructor/sections/{sectionId}/lessons")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<LessonDto>> createLesson(@PathVariable Long sectionId, @Valid @RequestBody LessonDto lessonDto) {
        LessonDto created = lessonService.createLesson(sectionId, lessonDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Lesson created successfully", created));
    }

    @PutMapping("/api/instructor/lessons/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<LessonDto>> updateLesson(@PathVariable Long id, @Valid @RequestBody LessonDto lessonDto) {
        return ResponseEntity.ok(ApiResponse.success("Lesson updated successfully", lessonService.updateLesson(id, lessonDto)));
    }

    @DeleteMapping("/api/instructor/lessons/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteLesson(@PathVariable Long id) {
        lessonService.deleteLesson(id);
        return ResponseEntity.ok(ApiResponse.success("Lesson deleted successfully"));
    }
}

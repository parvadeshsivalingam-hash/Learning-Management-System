package com.lms.controller;

import com.lms.dto.ApiResponse;
import com.lms.dto.SectionDto;
import com.lms.service.SectionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class SectionController {

    private final SectionService sectionService;

    @GetMapping("/api/courses/{courseId}/sections")
    public ResponseEntity<ApiResponse<List<SectionDto>>> getSectionsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(ApiResponse.success("Sections retrieved", sectionService.getSectionsByCourseId(courseId)));
    }

    @PostMapping("/api/instructor/courses/{courseId}/sections")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<SectionDto>> createSection(@PathVariable Long courseId, @Valid @RequestBody SectionDto sectionDto) {
        SectionDto created = sectionService.createSection(courseId, sectionDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Section created successfully", created));
    }

    @PutMapping("/api/instructor/sections/{sectionId}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<SectionDto>> updateSection(@PathVariable Long sectionId, @Valid @RequestBody SectionDto sectionDto) {
        return ResponseEntity.ok(ApiResponse.success("Section updated successfully", sectionService.updateSection(sectionId, sectionDto)));
    }

    @DeleteMapping("/api/instructor/sections/{sectionId}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteSection(@PathVariable Long sectionId) {
        sectionService.deleteSection(sectionId);
        return ResponseEntity.ok(ApiResponse.success("Section deleted successfully"));
    }
}

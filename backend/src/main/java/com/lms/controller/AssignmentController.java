package com.lms.controller;

import com.lms.dto.ApiResponse;
import com.lms.dto.AssignmentDto;
import com.lms.dto.SubmissionDto;
import com.lms.dto.SubmissionGradeRequest;
import com.lms.service.AssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AssignmentController {

    private final AssignmentService assignmentService;

    @GetMapping("/api/courses/{courseId}/assignments")
    public ResponseEntity<ApiResponse<List<AssignmentDto>>> getAssignmentsByCourse(@PathVariable Long courseId) {
        return ResponseEntity.ok(ApiResponse.success("Assignments retrieved", assignmentService.getAssignmentsByCourseId(courseId)));
    }

    @GetMapping("/api/assignments/{id}")
    public ResponseEntity<ApiResponse<AssignmentDto>> getAssignmentById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Assignment details retrieved", assignmentService.getAssignmentById(id)));
    }

    @PostMapping("/api/instructor/assignments")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<AssignmentDto>> createAssignment(@Valid @RequestBody AssignmentDto assignmentDto) {
        AssignmentDto created = assignmentService.createAssignment(assignmentDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Assignment created successfully", created));
    }

    @PutMapping("/api/instructor/assignments/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<AssignmentDto>> updateAssignment(@PathVariable Long id, @Valid @RequestBody AssignmentDto assignmentDto) {
        return ResponseEntity.ok(ApiResponse.success("Assignment updated successfully", assignmentService.updateAssignment(id, assignmentDto)));
    }

    @DeleteMapping("/api/instructor/assignments/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteAssignment(@PathVariable Long id) {
        assignmentService.deleteAssignment(id);
        return ResponseEntity.ok(ApiResponse.success("Assignment deleted successfully"));
    }

    @PostMapping("/api/student/assignments/{id}/submit")
    @PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<SubmissionDto>> submitAssignment(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication authentication
    ) {
        String fileUrl = body.getOrDefault("fileUrl", "https://example.com/submission.pdf");
        SubmissionDto dto = assignmentService.submitAssignment(id, fileUrl, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Assignment submitted successfully", dto));
    }

    @PostMapping("/api/instructor/submissions/{id}/grade")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<SubmissionDto>> gradeSubmission(
            @PathVariable Long id,
            @Valid @RequestBody SubmissionGradeRequest gradeRequest,
            Authentication authentication
    ) {
        SubmissionDto graded = assignmentService.gradeSubmission(id, gradeRequest, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Submission graded successfully", graded));
    }

    @GetMapping("/api/student/submissions")
    @PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<SubmissionDto>>> getStudentSubmissions(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Submissions retrieved", assignmentService.getStudentSubmissions(authentication.getName())));
    }

    @GetMapping("/api/instructor/assignments/{assignmentId}/submissions")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<SubmissionDto>>> getAssignmentSubmissions(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(ApiResponse.success("Assignment submissions retrieved", assignmentService.getAssignmentSubmissions(assignmentId)));
    }
}

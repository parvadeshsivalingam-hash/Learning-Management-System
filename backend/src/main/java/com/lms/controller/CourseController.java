package com.lms.controller;

import com.lms.dto.ApiResponse;
import com.lms.dto.CourseDto;
import com.lms.entity.CourseLevel;
import com.lms.entity.CourseStatus;
import com.lms.service.CourseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping("/api/courses")
    public ResponseEntity<ApiResponse<Page<CourseDto>>> getCourses(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long category,
            @RequestParam(required = false) CourseLevel level,
            @RequestParam(required = false) CourseStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Page<CourseDto> courses = courseService.searchCourses(search, category, level, status, PageRequest.of(page, size, sort));
        return ResponseEntity.ok(ApiResponse.success("Courses retrieved successfully", courses));
    }

    @GetMapping("/api/courses/{id}")
    public ResponseEntity<ApiResponse<CourseDto>> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success("Course details retrieved", courseService.getCourseById(id)));
    }

    @GetMapping("/api/instructor/courses")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<CourseDto>>> getInstructorCourses(Authentication authentication) {
        List<CourseDto> courses = courseService.getInstructorCourses(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Instructor courses retrieved", courses));
    }

    @PostMapping("/api/instructor/courses")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<CourseDto>> createCourse(@Valid @RequestBody CourseDto courseDto, Authentication authentication) {
        CourseDto created = courseService.createCourse(courseDto, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Course created successfully", created));
    }

    @PutMapping("/api/instructor/courses/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<CourseDto>> updateCourse(@PathVariable Long id, @Valid @RequestBody CourseDto courseDto, Authentication authentication) {
        CourseDto updated = courseService.updateCourse(id, courseDto, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Course updated successfully", updated));
    }

    @DeleteMapping("/api/instructor/courses/{id}")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCourse(@PathVariable Long id, Authentication authentication) {
        courseService.deleteCourse(id, authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Course deleted successfully"));
    }
}

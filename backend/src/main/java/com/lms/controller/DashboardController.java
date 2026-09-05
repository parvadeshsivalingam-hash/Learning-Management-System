package com.lms.controller;

import com.lms.dto.ApiResponse;
import com.lms.dto.DashboardStatsDto;
import com.lms.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/api/admin/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getAdminDashboard() {
        return ResponseEntity.ok(ApiResponse.success("Admin dashboard statistics retrieved", dashboardService.getAdminStats()));
    }

    @GetMapping("/api/instructor/dashboard")
    @PreAuthorize("hasAnyRole('INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getInstructorDashboard(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Instructor dashboard statistics retrieved", dashboardService.getInstructorStats(authentication.getName())));
    }

    @GetMapping("/api/student/dashboard")
    @PreAuthorize("hasAnyRole('STUDENT', 'INSTRUCTOR', 'ADMIN')")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getStudentDashboard(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.success("Student dashboard statistics retrieved", dashboardService.getStudentStats(authentication.getName())));
    }
}

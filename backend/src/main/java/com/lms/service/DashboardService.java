package com.lms.service;

import com.lms.dto.DashboardStatsDto;

public interface DashboardService {
    DashboardStatsDto getAdminStats();
    DashboardStatsDto getInstructorStats(String instructorEmail);
    DashboardStatsDto getStudentStats(String studentEmail);
}

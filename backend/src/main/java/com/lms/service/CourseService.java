package com.lms.service;

import com.lms.dto.CourseDto;
import com.lms.entity.CourseLevel;
import com.lms.entity.CourseStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CourseService {
    Page<CourseDto> searchCourses(String search, Long categoryId, CourseLevel level, CourseStatus status, Pageable pageable);
    CourseDto getCourseById(Long id);
    CourseDto createCourse(CourseDto courseDto, String instructorEmail);
    CourseDto updateCourse(Long id, CourseDto courseDto, String currentUserEmail);
    void deleteCourse(Long id, String currentUserEmail);
    List<CourseDto> getInstructorCourses(String instructorEmail);
}

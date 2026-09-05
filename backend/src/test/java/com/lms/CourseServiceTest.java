package com.lms;

import com.lms.dto.CourseDto;
import com.lms.entity.*;
import com.lms.repository.*;
import com.lms.service.impl.CourseServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CourseServiceTest {

    @Mock
    private CourseRepository courseRepository;
    @Mock
    private CategoryRepository categoryRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private EnrollmentRepository enrollmentRepository;
    @Mock
    private SectionRepository sectionRepository;
    @Mock
    private LessonRepository lessonRepository;

    @InjectMocks
    private CourseServiceImpl courseService;

    private User instructor;
    private Course course;

    @BeforeEach
    void setUp() {
        instructor = User.builder()
                .id(2L)
                .name("Dr. Instructor")
                .email("instructor@example.com")
                .role(Role.INSTRUCTOR)
                .build();

        course = Course.builder()
                .id(10L)
                .title("Java Masterclass")
                .description("Complete Java course")
                .price(49.99)
                .level(CourseLevel.BEGINNER)
                .instructor(instructor)
                .status(CourseStatus.PUBLISHED)
                .build();
    }

    @Test
    void testCreateCourseSuccess() {
        CourseDto dto = CourseDto.builder()
                .title("Java Masterclass")
                .description("Complete Java course")
                .price(49.99)
                .level(CourseLevel.BEGINNER)
                .build();

        when(userRepository.findByEmail("instructor@example.com")).thenReturn(Optional.of(instructor));
        when(courseRepository.save(any(Course.class))).thenReturn(course);
        when(enrollmentRepository.countByCourseId(10L)).thenReturn(0L);
        when(sectionRepository.findByCourseIdOrderByOrderIndexAsc(10L)).thenReturn(Collections.emptyList());
        when(lessonRepository.countByCourseId(10L)).thenReturn(0L);

        CourseDto result = courseService.createCourse(dto, "instructor@example.com");

        assertNotNull(result);
        assertEquals("Java Masterclass", result.getTitle());
        verify(courseRepository, times(1)).save(any(Course.class));
    }

    @Test
    void testGetCourseByIdSuccess() {
        when(courseRepository.findById(10L)).thenReturn(Optional.of(course));
        when(enrollmentRepository.countByCourseId(10L)).thenReturn(5L);
        when(sectionRepository.findByCourseIdOrderByOrderIndexAsc(10L)).thenReturn(Collections.emptyList());

        CourseDto result = courseService.getCourseById(10L);

        assertNotNull(result);
        assertEquals("Java Masterclass", result.getTitle());
        assertEquals(5L, result.getEnrolledCount());
    }
}

package com.lms.service.impl;

import com.lms.dto.CourseDto;
import com.lms.dto.LessonDto;
import com.lms.dto.SectionDto;
import com.lms.entity.*;
import com.lms.exception.ForbiddenException;
import com.lms.exception.ResourceNotFoundException;
import com.lms.repository.*;
import com.lms.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final SectionRepository sectionRepository;
    private final LessonRepository lessonRepository;

    @Override
    public Page<CourseDto> searchCourses(String search, Long categoryId, CourseLevel level, CourseStatus status, Pageable pageable) {
        return courseRepository.searchCourses(status, search, categoryId, level, pageable)
                .map(this::mapToDto);
    }

    @Override
    public CourseDto getCourseById(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));
        
        CourseDto dto = mapToDto(course);
        dto.setSections(getCourseSectionsWithLessons(course.getId()));
        return dto;
    }

    @Override
    public CourseDto createCourse(CourseDto courseDto, String instructorEmail) {
        User instructor = userRepository.findByEmail(instructorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found"));

        Category category = null;
        if (courseDto.getCategoryId() != null) {
            category = categoryRepository.findById(courseDto.getCategoryId()).orElse(null);
        }

        Course course = Course.builder()
                .title(courseDto.getTitle())
                .description(courseDto.getDescription())
                .thumbnail(courseDto.getThumbnail())
                .price(courseDto.getPrice() != null ? courseDto.getPrice() : 0.0)
                .level(courseDto.getLevel() != null ? courseDto.getLevel() : CourseLevel.BEGINNER)
                .category(category)
                .instructor(instructor)
                .status(courseDto.getStatus() != null ? courseDto.getStatus() : CourseStatus.PUBLISHED)
                .build();

        return mapToDto(courseRepository.save(course));
    }

    @Override
    public CourseDto updateCourse(Long id, CourseDto courseDto, String currentUserEmail) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (currentUser.getRole() != Role.ADMIN && !course.getInstructor().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You are not authorized to update this course");
        }

        course.setTitle(courseDto.getTitle());
        course.setDescription(courseDto.getDescription());
        if (courseDto.getThumbnail() != null) course.setThumbnail(courseDto.getThumbnail());
        if (courseDto.getPrice() != null) course.setPrice(courseDto.getPrice());
        if (courseDto.getLevel() != null) course.setLevel(courseDto.getLevel());
        if (courseDto.getStatus() != null) course.setStatus(courseDto.getStatus());

        if (courseDto.getCategoryId() != null) {
            Category category = categoryRepository.findById(courseDto.getCategoryId()).orElse(null);
            course.setCategory(category);
        }

        return mapToDto(courseRepository.save(course));
    }

    @Override
    public void deleteCourse(Long id, String currentUserEmail) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + id));

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (currentUser.getRole() != Role.ADMIN && !course.getInstructor().getId().equals(currentUser.getId())) {
            throw new ForbiddenException("You are not authorized to delete this course");
        }

        courseRepository.delete(course);
    }

    @Override
    public List<CourseDto> getInstructorCourses(String instructorEmail) {
        User instructor = userRepository.findByEmail(instructorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Instructor not found"));

        return courseRepository.findByInstructorId(instructor.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private CourseDto mapToDto(Course course) {
        long enrolled = enrollmentRepository.countByCourseId(course.getId());
        List<Section> sections = sectionRepository.findByCourseIdOrderByOrderIndexAsc(course.getId());
        long lessonsCount = lessonRepository.countByCourseId(course.getId());

        return CourseDto.builder()
                .id(course.getId())
                .title(course.getTitle())
                .description(course.getDescription())
                .thumbnail(course.getThumbnail())
                .price(course.getPrice())
                .level(course.getLevel())
                .categoryId(course.getCategory() != null ? course.getCategory().getId() : null)
                .categoryName(course.getCategory() != null ? course.getCategory().getName() : "General")
                .instructorId(course.getInstructor() != null ? course.getInstructor().getId() : null)
                .instructorName(course.getInstructor() != null ? course.getInstructor().getName() : "Instructor")
                .status(course.getStatus())
                .createdAt(course.getCreatedAt())
                .enrolledCount(enrolled)
                .sectionsCount(sections.size())
                .lessonsCount((int) lessonsCount)
                .build();
    }

    private List<SectionDto> getCourseSectionsWithLessons(Long courseId) {
        List<Section> sections = sectionRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
        return sections.stream().map(section -> {
            List<Lesson> lessons = lessonRepository.findBySectionIdOrderByOrderIndexAsc(section.getId());
            List<LessonDto> lessonDtos = lessons.stream().map(l -> LessonDto.builder()
                    .id(l.getId())
                    .sectionId(l.getSection().getId())
                    .title(l.getTitle())
                    .description(l.getDescription())
                    .videoUrl(l.getVideoUrl())
                    .duration(l.getDuration())
                    .resourceUrl(l.getResourceUrl())
                    .orderIndex(l.getOrderIndex())
                    .build()).collect(Collectors.toList());

            return SectionDto.builder()
                    .id(section.getId())
                    .courseId(section.getCourse().getId())
                    .title(section.getTitle())
                    .description(section.getDescription())
                    .orderIndex(section.getOrderIndex())
                    .lessons(lessonDtos)
                    .build();
        }).collect(Collectors.toList());
    }
}

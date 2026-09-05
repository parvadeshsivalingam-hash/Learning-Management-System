package com.lms.service.impl;

import com.lms.dto.LessonDto;
import com.lms.dto.SectionDto;
import com.lms.entity.Course;
import com.lms.entity.Lesson;
import com.lms.entity.Section;
import com.lms.exception.ResourceNotFoundException;
import com.lms.repository.CourseRepository;
import com.lms.repository.LessonRepository;
import com.lms.repository.SectionRepository;
import com.lms.service.SectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SectionServiceImpl implements SectionService {

    private final SectionRepository sectionRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;

    @Override
    public List<SectionDto> getSectionsByCourseId(Long courseId) {
        return sectionRepository.findByCourseIdOrderByOrderIndexAsc(courseId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public SectionDto createSection(Long courseId, SectionDto sectionDto) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));

        int orderIndex = sectionDto.getOrderIndex() != null ? sectionDto.getOrderIndex() : 
                sectionRepository.findByCourseIdOrderByOrderIndexAsc(courseId).size() + 1;

        Section section = Section.builder()
                .course(course)
                .title(sectionDto.getTitle())
                .description(sectionDto.getDescription())
                .orderIndex(orderIndex)
                .build();

        return mapToDto(sectionRepository.save(section));
    }

    @Override
    public SectionDto updateSection(Long sectionId, SectionDto sectionDto) {
        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found with id: " + sectionId));

        section.setTitle(sectionDto.getTitle());
        if (sectionDto.getDescription() != null) section.setDescription(sectionDto.getDescription());
        if (sectionDto.getOrderIndex() != null) section.setOrderIndex(sectionDto.getOrderIndex());

        return mapToDto(sectionRepository.save(section));
    }

    @Override
    public void deleteSection(Long sectionId) {
        if (!sectionRepository.existsById(sectionId)) {
            throw new ResourceNotFoundException("Section not found with id: " + sectionId);
        }
        sectionRepository.deleteById(sectionId);
    }

    private SectionDto mapToDto(Section section) {
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
    }
}

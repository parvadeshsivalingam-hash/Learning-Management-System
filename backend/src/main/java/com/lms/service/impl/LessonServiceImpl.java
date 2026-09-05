package com.lms.service.impl;

import com.lms.dto.LessonDto;
import com.lms.entity.Lesson;
import com.lms.entity.Section;
import com.lms.exception.ResourceNotFoundException;
import com.lms.repository.LessonRepository;
import com.lms.repository.SectionRepository;
import com.lms.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonServiceImpl implements LessonService {

    private final LessonRepository lessonRepository;
    private final SectionRepository sectionRepository;

    @Override
    public List<LessonDto> getLessonsBySectionId(Long sectionId) {
        return lessonRepository.findBySectionIdOrderByOrderIndexAsc(sectionId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public LessonDto getLessonById(Long id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + id));
        return mapToDto(lesson);
    }

    @Override
    public LessonDto createLesson(Long sectionId, LessonDto lessonDto) {
        Section section = sectionRepository.findById(sectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Section not found with id: " + sectionId));

        int orderIndex = lessonDto.getOrderIndex() != null ? lessonDto.getOrderIndex() :
                lessonRepository.findBySectionIdOrderByOrderIndexAsc(sectionId).size() + 1;

        Lesson lesson = Lesson.builder()
                .section(section)
                .title(lessonDto.getTitle())
                .description(lessonDto.getDescription())
                .videoUrl(lessonDto.getVideoUrl())
                .duration(lessonDto.getDuration() != null ? lessonDto.getDuration() : 10)
                .resourceUrl(lessonDto.getResourceUrl())
                .orderIndex(orderIndex)
                .build();

        return mapToDto(lessonRepository.save(lesson));
    }

    @Override
    public LessonDto updateLesson(Long id, LessonDto lessonDto) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + id));

        lesson.setTitle(lessonDto.getTitle());
        if (lessonDto.getDescription() != null) lesson.setDescription(lessonDto.getDescription());
        if (lessonDto.getVideoUrl() != null) lesson.setVideoUrl(lessonDto.getVideoUrl());
        if (lessonDto.getDuration() != null) lesson.setDuration(lessonDto.getDuration());
        if (lessonDto.getResourceUrl() != null) lesson.setResourceUrl(lessonDto.getResourceUrl());
        if (lessonDto.getOrderIndex() != null) lesson.setOrderIndex(lessonDto.getOrderIndex());

        return mapToDto(lessonRepository.save(lesson));
    }

    @Override
    public void deleteLesson(Long id) {
        if (!lessonRepository.existsById(id)) {
            throw new ResourceNotFoundException("Lesson not found with id: " + id);
        }
        lessonRepository.deleteById(id);
    }

    private LessonDto mapToDto(Lesson lesson) {
        return LessonDto.builder()
                .id(lesson.getId())
                .sectionId(lesson.getSection().getId())
                .title(lesson.getTitle())
                .description(lesson.getDescription())
                .videoUrl(lesson.getVideoUrl())
                .duration(lesson.getDuration())
                .resourceUrl(lesson.getResourceUrl())
                .orderIndex(lesson.getOrderIndex())
                .build();
    }
}

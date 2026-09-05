package com.lms.service;

import com.lms.dto.LessonDto;

import java.util.List;

public interface LessonService {
    List<LessonDto> getLessonsBySectionId(Long sectionId);
    LessonDto getLessonById(Long id);
    LessonDto createLesson(Long sectionId, LessonDto lessonDto);
    LessonDto updateLesson(Long id, LessonDto lessonDto);
    void deleteLesson(Long id);
}

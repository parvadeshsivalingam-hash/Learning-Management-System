package com.lms.service;

import com.lms.dto.LessonProgressDto;

import java.util.List;

public interface LessonProgressService {
    LessonProgressDto toggleLessonCompletion(Long lessonId, String studentEmail, boolean completed);
    List<LessonProgressDto> getStudentProgress(Long courseId, String studentEmail);
}

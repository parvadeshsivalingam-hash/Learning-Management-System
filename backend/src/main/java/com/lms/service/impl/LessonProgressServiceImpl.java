package com.lms.service.impl;

import com.lms.dto.LessonProgressDto;
import com.lms.entity.Lesson;
import com.lms.entity.LessonProgress;
import com.lms.entity.User;
import com.lms.exception.ResourceNotFoundException;
import com.lms.repository.LessonProgressRepository;
import com.lms.repository.LessonRepository;
import com.lms.repository.UserRepository;
import com.lms.service.LessonProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LessonProgressServiceImpl implements LessonProgressService {

    private final LessonProgressRepository lessonProgressRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;

    @Override
    public LessonProgressDto toggleLessonCompletion(Long lessonId, String studentEmail, boolean completed) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        Optional<LessonProgress> existingProgress = lessonProgressRepository.findByStudentIdAndLessonId(student.getId(), lesson.getId());

        LessonProgress progress;
        if (existingProgress.isPresent()) {
            progress = existingProgress.get();
            progress.setCompleted(completed);
            if (completed && progress.getCompletedAt() == null) {
                progress.setCompletedAt(LocalDateTime.now());
            }
        } else {
            progress = LessonProgress.builder()
                    .student(student)
                    .lesson(lesson)
                    .completed(completed)
                    .completedAt(completed ? LocalDateTime.now() : null)
                    .build();
        }

        LessonProgress saved = lessonProgressRepository.save(progress);
        return mapToDto(saved);
    }

    @Override
    public List<LessonProgressDto> getStudentProgress(Long courseId, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        return lessonProgressRepository.findByStudentIdAndCourseId(student.getId(), courseId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private LessonProgressDto mapToDto(LessonProgress progress) {
        return LessonProgressDto.builder()
                .id(progress.getId())
                .studentId(progress.getStudent().getId())
                .lessonId(progress.getLesson().getId())
                .completed(progress.isCompleted())
                .completedAt(progress.getCompletedAt())
                .build();
    }
}

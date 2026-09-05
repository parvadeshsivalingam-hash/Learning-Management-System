package com.lms.service.impl;

import com.lms.dto.AssignmentDto;
import com.lms.dto.SubmissionDto;
import com.lms.dto.SubmissionGradeRequest;
import com.lms.entity.Assignment;
import com.lms.entity.Course;
import com.lms.entity.Submission;
import com.lms.entity.User;
import com.lms.exception.BadRequestException;
import com.lms.exception.ResourceNotFoundException;
import com.lms.repository.AssignmentRepository;
import com.lms.repository.CourseRepository;
import com.lms.repository.SubmissionRepository;
import com.lms.repository.UserRepository;
import com.lms.service.AssignmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentServiceImpl implements AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final CourseRepository courseRepository;
    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;

    @Override
    public List<AssignmentDto> getAssignmentsByCourseId(Long courseId) {
        return assignmentRepository.findByCourseId(courseId).stream()
                .map(this::mapToAssignmentDto)
                .collect(Collectors.toList());
    }

    @Override
    public AssignmentDto getAssignmentById(Long assignmentId) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + assignmentId));
        return mapToAssignmentDto(assignment);
    }

    @Override
    public AssignmentDto createAssignment(AssignmentDto assignmentDto) {
        Course course = courseRepository.findById(assignmentDto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + assignmentDto.getCourseId()));

        Assignment assignment = Assignment.builder()
                .course(course)
                .title(assignmentDto.getTitle())
                .description(assignmentDto.getDescription())
                .dueDate(assignmentDto.getDueDate() != null ? assignmentDto.getDueDate() : LocalDateTime.now().plusDays(7))
                .maxMarks(assignmentDto.getMaxMarks() != null ? assignmentDto.getMaxMarks() : 100)
                .build();

        return mapToAssignmentDto(assignmentRepository.save(assignment));
    }

    @Override
    public AssignmentDto updateAssignment(Long assignmentId, AssignmentDto assignmentDto) {
        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + assignmentId));

        assignment.setTitle(assignmentDto.getTitle());
        if (assignmentDto.getDescription() != null) assignment.setDescription(assignmentDto.getDescription());
        if (assignmentDto.getDueDate() != null) assignment.setDueDate(assignmentDto.getDueDate());
        if (assignmentDto.getMaxMarks() != null) assignment.setMaxMarks(assignmentDto.getMaxMarks());

        return mapToAssignmentDto(assignmentRepository.save(assignment));
    }

    @Override
    public void deleteAssignment(Long assignmentId) {
        if (!assignmentRepository.existsById(assignmentId)) {
            throw new ResourceNotFoundException("Assignment not found with id: " + assignmentId);
        }
        assignmentRepository.deleteById(assignmentId);
    }

    @Override
    public SubmissionDto submitAssignment(Long assignmentId, String fileUrl, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Assignment not found with id: " + assignmentId));

        Optional<Submission> existing = submissionRepository.findByAssignmentIdAndStudentId(assignment.getId(), student.getId());

        Submission submission;
        if (existing.isPresent()) {
            submission = existing.get();
            submission.setFileUrl(fileUrl);
            submission.setSubmittedAt(LocalDateTime.now());
        } else {
            submission = Submission.builder()
                    .assignment(assignment)
                    .student(student)
                    .fileUrl(fileUrl)
                    .submittedAt(LocalDateTime.now())
                    .build();
        }

        return mapToSubmissionDto(submissionRepository.save(submission));
    }

    @Override
    public SubmissionDto gradeSubmission(Long submissionId, SubmissionGradeRequest gradeRequest, String instructorEmail) {
        Submission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new ResourceNotFoundException("Submission not found with id: " + submissionId));

        if (gradeRequest.getMarks() > submission.getAssignment().getMaxMarks()) {
            throw new BadRequestException("Marks cannot exceed assignment maximum marks (" + submission.getAssignment().getMaxMarks() + ")");
        }

        submission.setMarks(gradeRequest.getMarks());
        submission.setFeedback(gradeRequest.getFeedback());

        return mapToSubmissionDto(submissionRepository.save(submission));
    }

    @Override
    public List<SubmissionDto> getStudentSubmissions(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        return submissionRepository.findByStudentId(student.getId()).stream()
                .map(this::mapToSubmissionDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SubmissionDto> getAssignmentSubmissions(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId).stream()
                .map(this::mapToSubmissionDto)
                .collect(Collectors.toList());
    }

    private AssignmentDto mapToAssignmentDto(Assignment assignment) {
        return AssignmentDto.builder()
                .id(assignment.getId())
                .courseId(assignment.getCourse().getId())
                .title(assignment.getTitle())
                .description(assignment.getDescription())
                .dueDate(assignment.getDueDate())
                .maxMarks(assignment.getMaxMarks())
                .build();
    }

    private SubmissionDto mapToSubmissionDto(Submission submission) {
        return SubmissionDto.builder()
                .id(submission.getId())
                .assignmentId(submission.getAssignment().getId())
                .assignmentTitle(submission.getAssignment().getTitle())
                .studentId(submission.getStudent().getId())
                .studentName(submission.getStudent().getName())
                .fileUrl(submission.getFileUrl())
                .submittedAt(submission.getSubmittedAt())
                .marks(submission.getMarks())
                .maxMarks(submission.getAssignment().getMaxMarks())
                .feedback(submission.getFeedback())
                .build();
    }
}

package com.lms.service;

import com.lms.dto.AssignmentDto;
import com.lms.dto.SubmissionDto;
import com.lms.dto.SubmissionGradeRequest;

import java.util.List;

public interface AssignmentService {
    List<AssignmentDto> getAssignmentsByCourseId(Long courseId);
    AssignmentDto getAssignmentById(Long assignmentId);
    AssignmentDto createAssignment(AssignmentDto assignmentDto);
    AssignmentDto updateAssignment(Long assignmentId, AssignmentDto assignmentDto);
    void deleteAssignment(Long assignmentId);

    SubmissionDto submitAssignment(Long assignmentId, String fileUrl, String studentEmail);
    SubmissionDto gradeSubmission(Long submissionId, SubmissionGradeRequest gradeRequest, String instructorEmail);
    List<SubmissionDto> getStudentSubmissions(String studentEmail);
    List<SubmissionDto> getAssignmentSubmissions(Long assignmentId);
}

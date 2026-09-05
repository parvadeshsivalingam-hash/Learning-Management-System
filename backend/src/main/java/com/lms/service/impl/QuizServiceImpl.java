package com.lms.service.impl;

import com.lms.dto.*;
import com.lms.entity.*;
import com.lms.exception.BadRequestException;
import com.lms.exception.ResourceNotFoundException;
import com.lms.repository.*;
import com.lms.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizServiceImpl implements QuizService {

    private final QuizRepository quizRepository;
    private final CourseRepository courseRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final UserRepository userRepository;

    @Override
    public List<QuizDto> getQuizzesByCourseId(Long courseId) {
        return quizRepository.findByCourseId(courseId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public QuizDto getQuizById(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));
        return mapToDto(quiz);
    }

    @Override
    public QuizDto createQuiz(QuizDto quizDto) {
        Course course = courseRepository.findById(quizDto.getCourseId())
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + quizDto.getCourseId()));

        Quiz quiz = Quiz.builder()
                .course(course)
                .title(quizDto.getTitle())
                .description(quizDto.getDescription())
                .timeLimit(quizDto.getTimeLimit() != null ? quizDto.getTimeLimit() : 15)
                .build();

        Quiz savedQuiz = quizRepository.save(quiz);

        if (quizDto.getQuestions() != null && !quizDto.getQuestions().isEmpty()) {
            for (QuestionDto qDto : quizDto.getQuestions()) {
                Question question = Question.builder()
                        .quiz(savedQuiz)
                        .questionText(qDto.getQuestionText())
                        .build();
                Question savedQuestion = questionRepository.save(question);

                if (qDto.getAnswers() != null) {
                    for (AnswerDto aDto : qDto.getAnswers()) {
                        Answer answer = Answer.builder()
                                .question(savedQuestion)
                                .answerText(aDto.getAnswerText())
                                .isCorrect(aDto.isCorrect())
                                .build();
                        answerRepository.save(answer);
                    }
                }
            }
        }

        return mapToDto(savedQuiz);
    }

    @Override
    public QuizDto updateQuiz(Long quizId, QuizDto quizDto) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));

        quiz.setTitle(quizDto.getTitle());
        if (quizDto.getDescription() != null) quiz.setDescription(quizDto.getDescription());
        if (quizDto.getTimeLimit() != null) quiz.setTimeLimit(quizDto.getTimeLimit());

        return mapToDto(quizRepository.save(quiz));
    }

    @Override
    public void deleteQuiz(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));
        quizRepository.delete(quiz);
    }

    @Override
    public QuizAttemptDto submitQuiz(QuizSubmissionRequest request, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        Quiz quiz = quizRepository.findById(request.getQuizId())
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + request.getQuizId()));

        List<Question> questions = questionRepository.findByQuizId(quiz.getId());
        if (questions.isEmpty()) {
            throw new BadRequestException("Quiz has no questions to evaluate");
        }

        int score = 0;
        Map<Long, Long> userAnswers = request.getAnswers() != null ? request.getAnswers() : Collections.emptyMap();

        for (Question question : questions) {
            Long selectedAnswerId = userAnswers.get(question.getId());
            if (selectedAnswerId != null) {
                Answer answer = answerRepository.findById(selectedAnswerId).orElse(null);
                if (answer != null && answer.getQuestion().getId().equals(question.getId()) && answer.isCorrect()) {
                    score++;
                }
            }
        }

        int totalQuestions = questions.size();
        double percentage = ((double) score / totalQuestions) * 100.0;
        boolean passed = percentage >= 70.0; // 70% pass threshold

        QuizAttempt attempt = QuizAttempt.builder()
                .student(student)
                .quiz(quiz)
                .score(score)
                .totalQuestions(totalQuestions)
                .passed(passed)
                .startedAt(LocalDateTime.now().minusMinutes(5))
                .completedAt(LocalDateTime.now())
                .build();

        QuizAttempt savedAttempt = quizAttemptRepository.save(attempt);

        return QuizAttemptDto.builder()
                .id(savedAttempt.getId())
                .studentId(student.getId())
                .studentName(student.getName())
                .quizId(quiz.getId())
                .quizTitle(quiz.getTitle())
                .score(savedAttempt.getScore())
                .totalQuestions(savedAttempt.getTotalQuestions())
                .passed(savedAttempt.isPassed())
                .startedAt(savedAttempt.getStartedAt())
                .completedAt(savedAttempt.getCompletedAt())
                .build();
    }

    @Override
    public List<QuizAttemptDto> getStudentQuizAttempts(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));

        return quizAttemptRepository.findByStudentId(student.getId()).stream()
                .map(attempt -> QuizAttemptDto.builder()
                        .id(attempt.getId())
                        .studentId(student.getId())
                        .studentName(student.getName())
                        .quizId(attempt.getQuiz().getId())
                        .quizTitle(attempt.getQuiz().getTitle())
                        .score(attempt.getScore())
                        .totalQuestions(attempt.getTotalQuestions())
                        .passed(attempt.isPassed())
                        .startedAt(attempt.getStartedAt())
                        .completedAt(attempt.getCompletedAt())
                        .build())
                .collect(Collectors.toList());
    }

    private QuizDto mapToDto(Quiz quiz) {
        List<Question> questions = questionRepository.findByQuizId(quiz.getId());
        List<QuestionDto> questionDtos = questions.stream().map(q -> {
            List<Answer> answers = answerRepository.findByQuestionId(q.getId());
            List<AnswerDto> answerDtos = answers.stream().map(a -> AnswerDto.builder()
                    .id(a.getId())
                    .questionId(q.getId())
                    .answerText(a.getAnswerText())
                    .isCorrect(a.isCorrect())
                    .build()).collect(Collectors.toList());

            return QuestionDto.builder()
                    .id(q.getId())
                    .quizId(quiz.getId())
                    .questionText(q.getQuestionText())
                    .answers(answerDtos)
                    .build();
        }).collect(Collectors.toList());

        return QuizDto.builder()
                .id(quiz.getId())
                .courseId(quiz.getCourse().getId())
                .title(quiz.getTitle())
                .description(quiz.getDescription())
                .timeLimit(quiz.getTimeLimit())
                .questionsCount(questions.size())
                .questions(questionDtos)
                .build();
    }
}

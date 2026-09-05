package com.lms.util;

import com.lms.entity.*;
import com.lms.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final CourseRepository courseRepository;
    private final SectionRepository sectionRepository;
    private final LessonRepository lessonRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final AssignmentRepository assignmentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() == 0) {
            seedDatabase();
        }
    }

    private void seedDatabase() {
        // 1. Seed Users
        User admin = User.builder()
                .name("Admin User")
                .email("admin@lms.com")
                .password(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .status(UserStatus.ACTIVE)
                .profileImage("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150")
                .build();
        userRepository.save(admin);

        User instructor = User.builder()
                .name("Dr. Sarah Jenkins")
                .email("instructor@lms.com")
                .password(passwordEncoder.encode("instructor123"))
                .role(Role.INSTRUCTOR)
                .status(UserStatus.ACTIVE)
                .profileImage("https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150")
                .build();
        userRepository.save(instructor);

        User student = User.builder()
                .name("Alex Morgan")
                .email("student@lms.com")
                .password(passwordEncoder.encode("student123"))
                .role(Role.STUDENT)
                .status(UserStatus.ACTIVE)
                .profileImage("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150")
                .build();
        userRepository.save(student);

        // 2. Seed Categories
        Category catWeb = Category.builder().name("Web Development").description("Frontend and backend web software engineering.").build();
        Category catData = Category.builder().name("Data Science").description("Data analytics, machine learning, and AI.").build();
        Category catDesign = Category.builder().name("UI/UX Design").description("User interface and experience design principles.").build();
        categoryRepository.saveAll(List.of(catWeb, catData, catDesign));

        // 3. Seed Courses
        Course course1 = Course.builder()
                .title("Full-Stack React & Spring Boot Mastery")
                .description("Master modern web application development using React, Spring Boot, JPA, MySQL, and Tailwind CSS.")
                .thumbnail("https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600")
                .price(89.99)
                .level(CourseLevel.INTERMEDIATE)
                .category(catWeb)
                .instructor(instructor)
                .status(CourseStatus.PUBLISHED)
                .build();

        Course course2 = Course.builder()
                .title("Data Science & Machine Learning Fundamentals")
                .description("Comprehensive guide to data analysis, Python, Pandas, and neural networks.")
                .thumbnail("https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600")
                .price(99.99)
                .level(CourseLevel.BEGINNER)
                .category(catData)
                .instructor(instructor)
                .status(CourseStatus.PUBLISHED)
                .build();
        courseRepository.saveAll(List.of(course1, course2));

        // 4. Seed Sections & Lessons
        Section sec1 = Section.builder().course(course1).title("Section 1: Architecture & Setup").description("Environment configuration").orderIndex(1).build();
        Section sec2 = Section.builder().course(course1).title("Section 2: Building REST APIs").description("Controllers, Services, Repositories").orderIndex(2).build();
        sectionRepository.saveAll(List.of(sec1, sec2));

        Lesson les1 = Lesson.builder().section(sec1).title("1. Course Introduction & Tooling").description("Overview of the tech stack.").videoUrl("https://www.w3schools.com/html/mov_bbb.mp4").duration(12).orderIndex(1).build();
        Lesson les2 = Lesson.builder().section(sec1).title("2. Spring Boot Core Concepts").description("Beans, IoC Container, Dependency Injection.").videoUrl("https://www.w3schools.com/html/mov_bbb.mp4").duration(20).orderIndex(2).build();
        Lesson les3 = Lesson.builder().section(sec2).title("3. Spring Security & JWT Filter").description("Securing REST endpoints.").videoUrl("https://www.w3schools.com/html/mov_bbb.mp4").duration(25).orderIndex(1).build();
        lessonRepository.saveAll(List.of(les1, les2, les3));

        // 5. Seed Quizzes
        Quiz quiz = Quiz.builder().course(course1).title("Spring Boot & Security Basics Quiz").description("Test your knowledge of Spring Security and JWT.").timeLimit(10).build();
        quizRepository.save(quiz);

        Question q1 = Question.builder().quiz(quiz).questionText("Which annotation is used to designate a class as a REST Controller in Spring Boot?").build();
        questionRepository.save(q1);

        Answer a1 = Answer.builder().question(q1).answerText("@RestController").isCorrect(true).build();
        Answer a2 = Answer.builder().question(q1).answerText("@Controller").isCorrect(false).build();
        Answer a3 = Answer.builder().question(q1).answerText("@Service").isCorrect(false).build();
        Answer a4 = Answer.builder().question(q1).answerText("@Component").isCorrect(false).build();
        answerRepository.saveAll(List.of(a1, a2, a3, a4));

        // 6. Seed Assignments
        Assignment assignment = Assignment.builder()
                .course(course1)
                .title("Build a Custom Spring Security JWT Authentication Endpoint")
                .description("Implement password hashing and token generation in a standalone project.")
                .dueDate(LocalDateTime.now().plusDays(10))
                .maxMarks(100)
                .build();
        assignmentRepository.save(assignment);

        // 7. Seed Enrollment for Demo Student
        Enrollment enrollment = Enrollment.builder()
                .student(student)
                .course(course1)
                .status(EnrollmentStatus.ACTIVE)
                .build();
        enrollmentRepository.save(enrollment);
    }
}

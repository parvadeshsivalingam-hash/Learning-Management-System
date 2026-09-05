import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Initial Mock Data Fallback in case backend server is starting up or unreachable
export const MOCK_USERS = [
  { id: 1, name: 'Parvadesh', email: 'parvadeshmsd@gmail.com', username: 'parvadesh', password: 'password123', role: 'ADMIN', status: 'ACTIVE', bio: 'Platform Lead Administrator' }
];

export const MOCK_COURSES = [
  {
    id: 1,
    title: 'Full-Stack Web Development Bootcamp',
    description: 'Master modern web application design with React, Node.js, and Spring Boot backend engineering.',
    category: 'Development',
    level: 'Beginner to Advanced',
    instructorId: 2,
    instructorName: 'Dr. Sarah Jenkins',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
    syllabus: 'Module 1: Web Architecture & DOM\nModule 2: React 19 & Tailwind System\nModule 3: Spring Boot JPA Security & REST\nModule 4: CI/CD & Deployment',
    price: 299.99,
    creditPoints: 250,
    isPublished: true
  },
  {
    id: 2,
    title: 'Data Science & Machine Learning Fundamentals',
    description: 'Comprehensive course covering Python, data analytics, predictive modeling, and neural networks.',
    category: 'Data Science',
    level: 'Intermediate',
    instructorId: 3,
    instructorName: 'Prof. Michael Chang',
    thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
    syllabus: 'Module 1: Python NumPy & Pandas\nModule 2: Statistical Modeling\nModule 3: Scikit-learn Classifiers\nModule 4: Deep Neural Networks',
    price: 349.99,
    creditPoints: 300,
    isPublished: true
  },
  {
    id: 3,
    title: 'UI/UX Design Systems & Product Strategy',
    description: 'Design beautiful user-centered digital interfaces with Figma, modern typography, and design tokens.',
    category: 'Design',
    level: 'All Levels',
    instructorId: 2,
    instructorName: 'Dr. Sarah Jenkins',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=600&auto=format&fit=crop&q=80',
    syllabus: 'Module 1: User Research & Wireframing\nModule 2: Figma Design System Tokens\nModule 3: Accessibility & Micro-interactions',
    price: 199.99,
    creditPoints: 150,
    isPublished: true
  }
];

export const MOCK_TEAMS = [
  { id: 1, name: 'Alpha Web Engineers Cohort', description: 'Accelerated web engineering team', instructorId: 2, instructorName: 'Dr. Sarah Jenkins', courseId: 1, courseTitle: 'Full-Stack Web Development Bootcamp', memberCount: 2 },
  { id: 2, name: 'Data Analytics Squad 2026', description: 'Specialized machine learning research cohort', instructorId: 3, instructorName: 'Prof. Michael Chang', courseId: 2, courseTitle: 'Data Science & Machine Learning Fundamentals', memberCount: 1 }
];

export const MOCK_APPROVALS = [
  { id: 1, requesterId: 4, requesterName: 'Alex Vance', requesterEmail: 'pending.staff@lms.com', requesterRole: 'STAFF', type: 'REGISTRATION', status: 'PENDING', targetTitle: 'Instructor Account Activation', requestedAt: new Date().toISOString() },
  { id: 2, requesterId: 7, requesterName: 'Jordan Miller', requesterEmail: 'pending.student@lms.com', requesterRole: 'STUDENT', type: 'REGISTRATION', status: 'PENDING', targetTitle: 'Student Account Activation', requestedAt: new Date().toISOString() },
  { id: 3, requesterId: 3, requesterName: 'Prof. Michael Chang', requesterEmail: 'michael.chang@lms.com', requesterRole: 'STAFF', type: 'COURSE_SUBMISSION', status: 'PENDING', targetTitle: 'Curriculum Audit: Data Science Fundamentals', requestedAt: new Date().toISOString() },
  { id: 4, requesterId: 5, requesterName: 'Alex Rivera', requesterEmail: 'student@lms.com', requesterRole: 'STUDENT', type: 'CERTIFICATE_REQUEST', status: 'PENDING', targetTitle: 'Certificate Issuance Request for Data Science', requestedAt: new Date().toISOString() }
];

export const MOCK_CERTIFICATES = [
  { id: 1, studentId: 5, studentName: 'Alex Rivera', courseId: 2, courseTitle: 'Data Science & Machine Learning Fundamentals', certificateCode: 'LMS-CERT-2026-88492', issueDate: '2026-08-10T14:30:00' }
];

export const MOCK_FEEDBACK = [
  { id: 1, userId: 5, userName: 'Alex Rivera', userRole: 'STUDENT', courseId: 1, courseTitle: 'Full-Stack Web Development Bootcamp', rating: 5, comment: 'The Spring Boot modules were detailed and super practical!', category: 'COURSE', adminResponse: 'Thank you Alex! Glad you enjoyed it.', isFlagged: false },
  { id: 2, userId: 6, userName: 'Elena Rostova', userRole: 'STUDENT', courseId: null, courseTitle: 'Platform General', rating: 5, comment: 'Sleek dashboard layout and fast course video loads!', category: 'PLATFORM', adminResponse: null, isFlagged: false }
];

export const apiService = {
  // Authentication
  async login(email, password, role) {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/login`, { username: email, email, password, role });
      return res.data;
    } catch (err) {
      if (err.response?.data) throw new Error(err.response.data.message || 'Login failed');
      // Mock fallback
      const cleanInput = (email || '').toLowerCase().trim();
      const user = MOCK_USERS.find(u => 
        (u.email && u.email.toLowerCase() === cleanInput) ||
        (u.username && u.username.toLowerCase() === cleanInput) ||
        (u.name && u.name.toLowerCase() === cleanInput)
      );

      if (!user) throw new Error('Invalid email/username or password.');
      if (user.password && user.password !== password) throw new Error('Invalid email/username or password.');
      if (user.status === 'DEACTIVATED' || user.status === 'REJECTED') throw new Error(`Account is ${user.status}.`);

      return { token: 'mock-jwt-token-' + Date.now(), user, message: 'Login successful!' };
    }
  },

  async register(name, email, password, role, bio) {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/register`, { name, email, username: email, password, role, bio });
      return res.data;
    } catch (err) {
      if (err.response?.data) throw new Error(err.response.data.message);
      // Fallback local mock registration - set ACTIVE so user can log in immediately after log out
      const newId = MOCK_USERS.length + 1;
      const newUser = { id: newId, name, email, username: email, password, role: role || 'ADMIN', status: 'ACTIVE', bio };
      
      const existingIdx = MOCK_USERS.findIndex(u => u.email?.toLowerCase() === email?.toLowerCase());
      if (existingIdx !== -1) {
        MOCK_USERS[existingIdx] = newUser;
      } else {
        MOCK_USERS.push(newUser);
      }

      return { message: 'Registration successful! You can now log in.', status: 'ACTIVE', user: newUser, userId: newId };
    }
  },

  async resetPassword(email, role, newPassword) {
    try {
      const res = await axios.post(`${API_BASE_URL}/auth/forgot-password`, { email, role, newPassword });
      return res.data;
    } catch (err) {
      if (err.response?.data) throw new Error(err.response.data.message);
      return { message: 'Password reset processed! You can now log in with your updated credentials.' };
    }
  },

  // Admin API
  async getAdminStats() {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/stats`);
      return res.data;
    } catch {
      return {
        totalUsers: MOCK_USERS.length,
        totalCourses: MOCK_COURSES.length,
        totalTeams: MOCK_TEAMS.length,
        totalEnrollments: 8,
        pendingApprovals: MOCK_APPROVALS.filter(a => a.status === 'PENDING').length,
        roleDistribution: { ADMIN: 1, STAFF: 3, STUDENT: 3 },
        userStatusDistribution: { ACTIVE: 5, PENDING: 2, DEACTIVATED: 0, REJECTED: 0 },
        courseAnalytics: MOCK_COURSES.map(c => ({
          id: c.id,
          title: c.title,
          category: c.category,
          enrollments: Math.floor(Math.random() * 15) + 5,
          completed: Math.floor(Math.random() * 5) + 1,
          completionRate: Math.floor(Math.random() * 40) + 60
        }))
      };
    }
  },

  async getUsers() {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/users`);
      return res.data;
    } catch {
      return MOCK_USERS;
    }
  },

  async createUser(userData) {
    try {
      const res = await axios.post(`${API_BASE_URL}/admin/users`, userData);
      return res.data;
    } catch {
      const newUser = { id: Date.now(), ...userData, status: 'ACTIVE' };
      MOCK_USERS.push(newUser);
      return newUser;
    }
  },

  async updateUser(userId, userData) {
    try {
      const res = await axios.put(`${API_BASE_URL}/admin/users/${userId}`, userData);
      return res.data;
    } catch {
      const u = MOCK_USERS.find(x => x.id === userId);
      if (u) {
        Object.assign(u, userData);
      }
      return u;
    }
  },

  async updateUserStatus(userId, status) {
    try {
      const res = await axios.patch(`${API_BASE_URL}/admin/users/${userId}/status`, { status });
      return res.data;
    } catch {
      const u = MOCK_USERS.find(x => x.id === userId);
      if (u) u.status = status;
      return u;
    }
  },

  async deleteUser(userId) {
    try {
      await axios.delete(`${API_BASE_URL}/admin/users/${userId}`);
    } catch {
      const idx = MOCK_USERS.findIndex(x => x.id === userId);
      if (idx !== -1) MOCK_USERS.splice(idx, 1);
    }
  },

  // Courses
  async getCourses() {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/courses`);
      return res.data;
    } catch {
      return MOCK_COURSES;
    }
  },

  async createCourse(courseData) {
    try {
      const res = await axios.post(`${API_BASE_URL}/admin/courses`, courseData);
      return res.data;
    } catch {
      const newCourse = { id: Date.now(), ...courseData, isPublished: true };
      MOCK_COURSES.push(newCourse);
      return newCourse;
    }
  },

  async updateCourse(courseId, courseData) {
    try {
      const res = await axios.put(`${API_BASE_URL}/admin/courses/${courseId}`, courseData);
      return res.data;
    } catch {
      const c = MOCK_COURSES.find(x => x.id === courseId);
      if (c) {
        Object.assign(c, courseData);
      }
      return c;
    }
  },

  async deleteCourse(courseId) {
    try {
      await axios.delete(`${API_BASE_URL}/admin/courses/${courseId}`);
    } catch {
      const idx = MOCK_COURSES.findIndex(x => x.id === courseId);
      if (idx !== -1) MOCK_COURSES.splice(idx, 1);
    }
  },

  async deleteTeam(teamId) {
    try {
      await axios.delete(`${API_BASE_URL}/admin/teams/${teamId}`);
    } catch {
      const idx = MOCK_TEAMS.findIndex(x => x.id === teamId);
      if (idx !== -1) MOCK_TEAMS.splice(idx, 1);
    }
  },

  async toggleCoursePublish(courseId) {
    try {
      const res = await axios.patch(`${API_BASE_URL}/admin/courses/${courseId}/publish`);
      return res.data;
    } catch {
      const c = MOCK_COURSES.find(x => x.id === courseId);
      if (c) c.isPublished = !c.isPublished;
      return c;
    }
  },

  // Approvals
  async getApprovals() {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/approvals`);
      return res.data;
    } catch {
      return MOCK_APPROVALS;
    }
  },

  async handleApprovalAction(id, action, reason) {
    try {
      const res = await axios.post(`${API_BASE_URL}/admin/approvals/${id}/action`, { action, reason });
      return res.data;
    } catch {
      const req = MOCK_APPROVALS.find(x => x.id === id);
      if (req) {
        req.status = action === 'APPROVE' ? 'APPROVED' : 'REJECTED';
        req.rejectionReason = reason;
        const u = MOCK_USERS.find(user => user.id === req.requesterId);
        if (u) u.status = action === 'APPROVE' ? 'ACTIVE' : 'REJECTED';
      }
      return req;
    }
  },

  // Certificates
  async getCertificates() {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/certificates`);
      return res.data;
    } catch {
      return MOCK_CERTIFICATES;
    }
  },

  async issueCertificate(studentId, courseId) {
    try {
      const res = await axios.post(`${API_BASE_URL}/admin/certificates/issue`, { studentId, courseId });
      return res.data;
    } catch {
      const student = MOCK_USERS.find(u => u.id === Number(studentId));
      const course = MOCK_COURSES.find(c => c.id === Number(courseId));
      const newCert = {
        id: Date.now(),
        studentId: Number(studentId),
        studentName: student ? student.name : 'Student',
        courseId: Number(courseId),
        courseTitle: course ? course.title : 'Course',
        certificateCode: 'LMS-CERT-2026-' + Math.floor(10000 + Math.random() * 90000),
        issueDate: new Date().toISOString()
      };
      MOCK_CERTIFICATES.push(newCert);
      return newCert;
    }
  },

  // Feedback
  async getFeedback() {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/feedback`);
      return res.data;
    } catch {
      return MOCK_FEEDBACK;
    }
  },

  async respondFeedback(id, responseText) {
    try {
      const res = await axios.post(`${API_BASE_URL}/admin/feedback/${id}/respond`, { response: responseText });
      return res.data;
    } catch {
      const fb = MOCK_FEEDBACK.find(x => x.id === id);
      if (fb) fb.adminResponse = responseText;
      return fb;
    }
  },

  // Teams
  async getTeams() {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/teams`);
      return res.data;
    } catch {
      return MOCK_TEAMS.map(t => ({ team: t, members: [], memberCount: t.memberCount }));
    }
  },

  async createTeam(teamData) {
    try {
      const res = await axios.post(`${API_BASE_URL}/admin/teams`, teamData);
      return res.data;
    } catch {
      const newTeam = {
        id: Date.now(),
        name: teamData.name,
        description: teamData.description,
        instructorId: Number(teamData.instructorId),
        instructorName: 'Instructor',
        courseId: Number(teamData.courseId),
        courseTitle: 'Course',
        memberCount: teamData.studentIds?.length || 0
      };
      MOCK_TEAMS.push(newTeam);
      return newTeam;
    }
  }
};

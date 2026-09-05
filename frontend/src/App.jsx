import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/auth/LandingPage';
import { LoginModal, RegisterModal } from './pages/auth/AuthModals';

// Admin Views
import { AdminDashboardView } from './pages/admin/AdminDashboardView';
import { UserManagementView } from './pages/admin/UserManagementView';
import { CourseManagementView } from './pages/admin/CourseManagementView';
import { TeamManagementView } from './pages/admin/TeamManagementView';
import { AnalyticsView } from './pages/admin/AnalyticsView';
import { CertificateManagementView } from './pages/admin/CertificateManagementView';
import { FeedbackView } from './pages/admin/FeedbackView';
import { ApprovalDashboardView } from './pages/admin/ApprovalDashboardView';

// Staff Views
import { StaffDashboardView } from './pages/staff/StaffDashboardView';
import { StaffCoursesView } from './pages/staff/StaffCoursesView';
import { StaffRosterView } from './pages/staff/StaffRosterView';
import { StaffGradingView } from './pages/staff/StaffGradingView';

// Student Views
import { StudentDashboardView } from './pages/student/StudentDashboardView';
import { CourseCatalogView } from './pages/student/CourseCatalogView';
import { MyCoursesView } from './pages/student/MyCoursesView';
import { CreditPointsView } from './pages/student/CreditPointsView';
import { StudentCertificatesView } from './pages/student/StudentCertificatesView';
import { StudentFeedbackView } from './pages/student/StudentFeedbackView';

const MainApp = () => {
  const { currentUser, userRole } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loginRole, setLoginRole] = useState(null); // 'ADMIN', 'STAFF', 'STUDENT'
  const [registerRole, setRegisterRole] = useState(null);

  if (!currentUser) {
    return <LandingPage defaultRole="ADMIN" defaultTab="login" />;
  }

  const renderRoleContent = () => {
    switch (userRole) {
      case 'ADMIN':
        switch (activeTab) {
          case 'dashboard': return <AdminDashboardView setActiveTab={setActiveTab} />;
          case 'users': return <UserManagementView />;
          case 'courses': return <CourseManagementView />;
          case 'teams': return <TeamManagementView />;
          case 'analytics': return <AnalyticsView />;
          case 'certificates': return <CertificateManagementView />;
          case 'feedback': return <FeedbackView />;
          case 'approvals': return <ApprovalDashboardView />;
          default: return <AdminDashboardView setActiveTab={setActiveTab} />;
        }

      case 'STAFF':
        switch (activeTab) {
          case 'dashboard': return <StaffDashboardView setActiveTab={setActiveTab} />;
          case 'my-courses': return <StaffCoursesView />;
          case 'students-teams': return <StaffRosterView />;
          case 'grading': return <StaffGradingView />;
          default: return <StaffDashboardView setActiveTab={setActiveTab} />;
        }

      case 'STUDENT':
        switch (activeTab) {
          case 'dashboard': return <StudentDashboardView setActiveTab={setActiveTab} />;
          case 'catalog': return <CourseCatalogView />;
          case 'my-learning': return <MyCoursesView />;
          case 'credits': return <CreditPointsView />;
          case 'my-certificates': return <StudentCertificatesView />;
          case 'submit-feedback': return <StudentFeedbackView />;
          default: return <StudentDashboardView setActiveTab={setActiveTab} />;
        }

      default:
        return <div className="p-8 text-slate-400">Unauthorized role session</div>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar activeView={activeTab} setActiveView={setActiveTab} />
      <div className="flex flex-1">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 bg-slate-950 overflow-y-auto min-h-[calc(100vh-4rem)]">
          {renderRoleContent()}
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

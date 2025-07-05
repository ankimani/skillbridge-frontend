import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from './components/pages/Layout';
import Home from './components/pages/Home';
import Search from './components/pages/Search';
import TeachersResults from './components/pages/TeachersResults';
import TutorProfile from './components/pages/TutorProfile';
import JobDisplay from './components/pages/JobDisplay';
import JobInformation from './components/pages/JobInformation';
import ProfileInfoForm from './components/pages/ProfileInfoForm';
import EducationForm from './components/pages/EducationForm';
import TeacherExpereinceForm from './components/pages/TeacherExpereinceForm';
import TeachingDetailsForm from './components/pages/TeachingDetailsForm';
import TeachersSubject from './components/pages/TeachersSubject';
import StudentDashboard from './components/student/StudentDashboard';
import TutorRequestForm from './components/student/TutorRequestForm';
import Coins from './components/student/Coins';
import Wallet from './components/student/Wallet';
import Tutors from './components/student/Tutors';
import Messages from './components/student/Messages';
import SuccessPage from './components/pages/SuccessPage';
import RegistrationForm from './components/pages/RegistrationForm';
import LoginForm from './components/pages/LoginForm';
import ResetPasswordEmail from './components/pages/ResetPasswordEmail';
import ResetPassword from './components/pages/ResetPassword';
import EmailVerification from './components/pages/EmailVerification';
import TeacherProfile from './components/pages/TeacherProfile';
import AllTeachersProfile from './components/pages/AllTeachersProfile';
import ViewTeacherProfile from './components/pages/ViewTeacherProfile';
import Chats from './components/chat/Chats';
import JobChat from './components/chat/JobChat';
import JobChatStudents from './components/chat/JobChatStudents';
import ChatsStudents from './components/chat/ChatsStudents';
import StudentProfile from './components/student/StudentProfile';
import StudentBioData from './components/student/StudentBioData';
import AdminDashboard from './components/admin/AdminDashboard';

// Utility function to decode JWT token
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

// Get user role from JWT token
const getUserRole = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return null;
  const decoded = decodeJWT(token);
  return decoded?.roles || null;
};

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Role Protected Route Component
const RoleProtectedRoute = ({ children, allowedRoles = [], deniedRoles = [], redirectPath = "/" }) => {
  const isAuthenticated = !!localStorage.getItem('authToken');
  const userRole = getUserRole();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (deniedRoles.includes(userRole)) {
    return <Navigate to={redirectPath} replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

// Custom Home Route Component
const HomeRoute = () => {
  const userRole = getUserRole();
  
  if (userRole === 'ROLE_ADMIN') {
    return <Navigate to="/admin" replace />;
  }
  
  return <Home />;
};

function App() {
  const [formData, setFormData] = useState({});
  
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomeRoute />} />
          <Route path="register" element={<RegistrationForm />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="resetlink" element={<ResetPasswordEmail />} />
          <Route path="passwordreset" element={<ResetPassword />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          
          {/* Admin-only Route */}
          <Route path="admin" element={
            <RoleProtectedRoute allowedRoles={['ROLE_ADMIN']}>
              <AdminDashboard />
            </RoleProtectedRoute>
          } />
          
          {/* Protected Routes - Denied to ROLE_TUTOR and ROLE_ADMIN */}
          <Route path="teachers" element={
            <RoleProtectedRoute deniedRoles={['ROLE_TUTOR', 'ROLE_ADMIN']}>
              <TeachersResults />
            </RoleProtectedRoute>
          } />
          <Route path="tutor-profile/:id" element={
            <RoleProtectedRoute deniedRoles={['ROLE_TUTOR', 'ROLE_ADMIN']}>
              <TutorProfile />
            </RoleProtectedRoute>
          } />
          <Route path="professionals" element={
            <RoleProtectedRoute deniedRoles={['ROLE_TUTOR', 'ROLE_ADMIN']}>
              <AllTeachersProfile />
            </RoleProtectedRoute>
          } />
          <Route path="teachers/:teacherId" element={
            <RoleProtectedRoute deniedRoles={['ROLE_TUTOR', 'ROLE_ADMIN']}>
              <ViewTeacherProfile />
            </RoleProtectedRoute>
          } />
          <Route path="studentdashboard" element={
            <RoleProtectedRoute deniedRoles={['ROLE_TUTOR', 'ROLE_ADMIN']}>
              <StudentDashboard />
            </RoleProtectedRoute>
          } />
          <Route path="postjob" element={
            <RoleProtectedRoute deniedRoles={['ROLE_TUTOR', 'ROLE_ADMIN']}>
              <TutorRequestForm />
            </RoleProtectedRoute>
          } />
          <Route path="/profile/:userId" element={
            <RoleProtectedRoute deniedRoles={['ROLE_TUTOR', 'ROLE_ADMIN']}>
              <StudentProfile />
            </RoleProtectedRoute>
          } />
          <Route path="profile-info" element={
            <RoleProtectedRoute deniedRoles={['ROLE_TUTOR', 'ROLE_ADMIN']}>
              <StudentBioData setFormData={setFormData} />
            </RoleProtectedRoute>
          } />

          {/* Protected Routes - Denied to ROLE_STUDENT and ROLE_ADMIN */}
          <Route path="jobs" element={
            <RoleProtectedRoute deniedRoles={['ROLE_STUDENT', 'ROLE_ADMIN']}>
              <JobDisplay />
            </RoleProtectedRoute>
          } />
          <Route path="jobinfo/:jobId" element={
            <RoleProtectedRoute deniedRoles={['ROLE_STUDENT', 'ROLE_ADMIN']}>
              <JobInformation />
            </RoleProtectedRoute>
          } />
          <Route path="profileform" element={
            <RoleProtectedRoute deniedRoles={['ROLE_STUDENT', 'ROLE_ADMIN']}>
              <ProfileInfoForm setFormData={setFormData} />
            </RoleProtectedRoute>
          } />
          <Route path="education" element={
            <RoleProtectedRoute deniedRoles={['ROLE_STUDENT', 'ROLE_ADMIN']}>
              <EducationForm setFormData={setFormData} />
            </RoleProtectedRoute>
          } />
          <Route path="experience" element={
            <RoleProtectedRoute deniedRoles={['ROLE_STUDENT', 'ROLE_ADMIN']}>
              <TeacherExpereinceForm setFormData={setFormData} />
            </RoleProtectedRoute>
          } />
          <Route path="subjects" element={
            <RoleProtectedRoute deniedRoles={['ROLE_STUDENT', 'ROLE_ADMIN']}>
              <TeachersSubject setFormData={setFormData} />
            </RoleProtectedRoute>
          } />
          <Route path="details" element={
            <RoleProtectedRoute deniedRoles={['ROLE_STUDENT', 'ROLE_ADMIN']}>
              <TeachingDetailsForm formData={formData} />
            </RoleProtectedRoute>
          } />
          <Route path="/profile" element={
            <RoleProtectedRoute deniedRoles={['ROLE_STUDENT', 'ROLE_ADMIN']}>
              <TeacherProfile />
            </RoleProtectedRoute>
          } />

          {/* Protected Routes - Accessible to all authenticated users except denied roles */}
          <Route path="search" element={
            <ProtectedRoute>
              <Search />
            </ProtectedRoute>
          } />
          <Route path="/messages" element={
            <ProtectedRoute>
              <Chats />
            </ProtectedRoute>
          } />
          <Route path="/job-chat/:jobId" element={
            <ProtectedRoute>
              <JobChat />
            </ProtectedRoute>
          } />
          <Route path="/client-messages" element={
            <ProtectedRoute>
              <ChatsStudents />
            </ProtectedRoute>
          } />
          <Route path="/client-chat/:jobId" element={
            <ProtectedRoute>
              <JobChatStudents />
            </ProtectedRoute>
          } />
          <Route path="coins" element={
            <ProtectedRoute>
              <Coins />
            </ProtectedRoute>
          } />
          <Route path="wallet" element={
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          } />
          <Route path="tutors" element={
            <ProtectedRoute>
              <Tutors />
            </ProtectedRoute>
          } />
          <Route path="messages2" element={
            <ProtectedRoute>
              <Messages />
            </ProtectedRoute>
          } />
          <Route path="complete" element={
            <ProtectedRoute>
              <SuccessPage />
            </ProtectedRoute>
          } />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
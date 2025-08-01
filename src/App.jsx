import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout, { LayoutWithoutHeader, LayoutNoHeaders } from './features/shared/Layout';
import Home from './components/pages/Home';
import Search from './features/jobs/Search';
import TeachersResults from './features/jobs/TeachersResults';
import TutorProfile from './features/jobs/TutorProfile';
import EducationForm from './features/tutor/EducationForm';
import TeacherExpereinceForm from './features/tutor/TeacherExpereinceForm';
import TeachingDetailsForm from './features/tutor/TeachingDetailsForm';
import TeachersSubject from './features/tutor/TeachersSubject';
import Coins from './features/student/Coins';
import Wallet from './features/student/Wallet';
import Tutors from './features/student/Tutors';
import Messages from './features/student/Messages';

import StudentProfile from './features/student/StudentProfile';
import StudentBioData from './features/student/StudentBioData';

import RouteGuard from './utils/routeProtection';
import { ROLES } from './constants/roles';
import { ROUTES } from './constants/routes';
import { useAuthStore } from './store/useAuthStore';
import { fetchUserProfile } from './components/services/authProfile';

// Lazy load major pages
import StudentDashboard from './features/student/StudentDashboard.jsx';
import ProfileInfoForm from './features/student/ProfileInfoForm.jsx';
import TutorRequestForm from './features/student/TutorRequestForm.jsx';
import SuccessPage from './features/student/SuccessPage.jsx';
import RegistrationForm from './features/auth/RegistrationForm.jsx';
import LoginForm from './features/auth/LoginForm.jsx';
import ResetPasswordEmail from './features/auth/ResetPasswordEmail.jsx';
import ResetPassword from './features/auth/ResetPassword.jsx';
import EmailVerification from './features/auth/EmailVerification.jsx';
import TeacherProfile from './features/tutor/TeacherProfile.jsx';
import AllTeachersProfile from './features/jobs/AllTeachersProfile.jsx';
import ViewTeacherProfile from './features/jobs/ViewTeacherProfile.jsx';
import Chats from './features/chat/Chats.jsx';
import JobChat from './features/chat/JobChat.jsx';
import ChatsStudents from './features/chat/ChatsStudents.jsx';
import JobChatStudents from './features/chat/JobChatStudents.jsx';
import AdminDashboard from './features/admin/AdminDashboard.jsx';
import JobDisplay from './features/jobs/JobDisplay.jsx';
import JobInformation from './features/jobs/JobInformation.jsx';
import ProfileEditModal from './features/student/ProfileEditModal.jsx';
import ChangePasswordModal from './features/student/ChangePasswordModal.jsx';
import SkeletonRequirementCard from './features/shared/SkeletonRequirementCard.jsx';
import SkeletonProfileCard from './features/shared/SkeletonProfileCard.jsx';
import SkeletonBioDataForm from './features/shared/SkeletonBioDataForm.jsx';
import SkeletonProfileInfoForm from './features/shared/SkeletonProfileInfoForm.jsx';
import SkeletonTutorRequestForm from './features/shared/SkeletonTutorRequestForm.jsx';

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

// Remove or comment out the HomeRoute component
const HomeRoute = () => {
  const userRole = getUserRole();
  if (userRole === ROLES.ADMIN) {
    return <Navigate to={ROUTES.ADMIN} replace />;
  }
  return <Home />;
};

function App() {
  const [formData, setFormData] = useState({});
  const isInitialized = useAuthStore((state) => state.isInitialized);
  
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    
    console.log('App: Initializing auth state, token exists:', !!token);
    
    if (token) {
      useAuthStore.getState().setToken(token);
      
      // Fetch and set user profile
      fetchUserProfile(token)
        .then((profile) => {
          console.log('App: User profile fetched successfully');
          useAuthStore.getState().setUser(profile);
          useAuthStore.getState().setInitialized(true);
        })
        .catch((error) => {
          console.error('Failed to fetch user profile:', error);
          // If fetching user fails, clear token
          useAuthStore.getState().logout();
        });
    } else {
      // No token found, mark as initialized
      console.log('App: No token found, marking as initialized');
      useAuthStore.getState().setInitialized(true);
    }
  }, []);
  
  // Monitor authentication state changes
  useEffect(() => {
    const token = useAuthStore.getState().token;
    const localStorageToken = localStorage.getItem('authToken');
    
    console.log('App: Auth state check:', {
      storeToken: !!token,
      localStorageToken: !!localStorageToken,
      isInitialized
    });
    
    // If store has no token but localStorage has one, sync them
    if (!token && localStorageToken) {
      console.log('App: Syncing token from localStorage to store');
      useAuthStore.getState().setToken(localStorageToken);
    }
    
    // If store has token but localStorage doesn't, clear store
    if (token && !localStorageToken) {
      console.log('App: Token missing from localStorage, clearing store');
      useAuthStore.getState().logout();
    }
  }, [isInitialized]);
  
  // Show loading while authentication is being initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  
  return (
    <Router>
      <Layout>
        <Routes>
            {/* Public Routes */}
            <Route path={ROUTES.HOME} element={<Home />} />
            <Route path={ROUTES.REGISTER} element={<RegistrationForm />} />
            <Route path={ROUTES.LOGIN} element={<LoginForm />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ResetPasswordEmail />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
            <Route path={ROUTES.VERIFY_EMAIL} element={<EmailVerification />} />
            
            {/* Admin-only Route */}
            <Route path={ROUTES.ADMIN} element={
              <RouteGuard allowedRoles={[ROLES.ADMIN]}>
                <AdminDashboard />
              </RouteGuard>
            } />
            
            {/* Protected Routes - Denied to ROLE_TUTOR and ROLE_ADMIN */}
            <Route path={ROUTES.TEACHERS} element={
              <RouteGuard deniedRoles={[ROLES.TUTOR, ROLES.ADMIN]}>
                <TeachersResults />
              </RouteGuard>
            } />
            <Route path={ROUTES.TUTOR_PROFILE} element={
              <RouteGuard deniedRoles={[ROLES.TUTOR, ROLES.ADMIN]}>
                <TutorProfile />
              </RouteGuard>
            } />
            <Route path={ROUTES.PROFESSIONALS} element={
              <RouteGuard deniedRoles={[ROLES.TUTOR, ROLES.ADMIN]}>
                <AllTeachersProfile />
              </RouteGuard>
            } />
            <Route path={ROUTES.TEACHERS_ID} element={
              <RouteGuard deniedRoles={[ROLES.TUTOR, ROLES.ADMIN]}>
                <ViewTeacherProfile />
              </RouteGuard>
            } />
            <Route path={ROUTES.STUDENT_DASHBOARD} element={
              <RouteGuard allowedRoles={[ROLES.STUDENT]}>
                <StudentDashboard />
              </RouteGuard>
            } />
            <Route path={ROUTES.POST_JOB} element={
              <RouteGuard allowedRoles={[ROLES.STUDENT]}>
                <TutorRequestForm />
              </RouteGuard>
            } />
            <Route path={ROUTES.STUDENT_PROFILE} element={
              <RouteGuard allowedRoles={['ROLE_STUDENT']}>
                <StudentProfile />
              </RouteGuard>
            } />
            <Route path={ROUTES.PROFILE_INFO} element={
              <RouteGuard>
                <ProfileInfoForm />
              </RouteGuard>
            } />
            <Route path={ROUTES.STUDENT_BIO_DATA} element={
              <RouteGuard allowedRoles={['ROLE_STUDENT']}>
                <StudentBioData />
              </RouteGuard>
            } />

            {/* Protected Routes - Denied to ROLE_STUDENT and ROLE_ADMIN */}
            <Route path={ROUTES.JOBS} element={
              <RouteGuard deniedRoles={[ROLES.STUDENT, ROLES.ADMIN]}>
                <JobDisplay />
              </RouteGuard>
            } />
            <Route path={ROUTES.JOB_INFO} element={
              <RouteGuard deniedRoles={[ROLES.STUDENT, ROLES.ADMIN]}>
                <JobInformation />
              </RouteGuard>
            } />
            <Route path={ROUTES.PROFILE_FORM} element={
              <RouteGuard deniedRoles={[ROLES.STUDENT, ROLES.ADMIN]}>
                <ProfileInfoForm setFormData={setFormData} />
              </RouteGuard>
            } />
            <Route path={ROUTES.EDUCATION} element={
              <RouteGuard deniedRoles={[ROLES.STUDENT, ROLES.ADMIN]}>
                <EducationForm setFormData={setFormData} />
              </RouteGuard>
            } />
            <Route path={ROUTES.EXPERIENCE} element={
              <RouteGuard deniedRoles={[ROLES.STUDENT, ROLES.ADMIN]}>
                <TeacherExpereinceForm setFormData={setFormData} />
              </RouteGuard>
            } />
            <Route path={ROUTES.SUBJECTS} element={
              <RouteGuard deniedRoles={[ROLES.STUDENT, ROLES.ADMIN]}>
                <TeachersSubject setFormData={setFormData} />
              </RouteGuard>
            } />
            <Route path={ROUTES.DETAILS} element={
              <RouteGuard deniedRoles={[ROLES.STUDENT, ROLES.ADMIN]}>
                <TeachingDetailsForm formData={formData} />
              </RouteGuard>
            } />
            <Route path={ROUTES.TEACHER_PROFILE} element={
              <RouteGuard allowedRoles={[ROLES.TUTOR]}>
                <TeacherProfile />
              </RouteGuard>
            } />

            {/* Protected Routes - Accessible to all authenticated users except denied roles */}
            <Route path={ROUTES.SEARCH} element={
              <RouteGuard>
                <Search />
              </RouteGuard>
            } />
            <Route path={ROUTES.MESSAGES} element={
              <RouteGuard>
                <Chats />
              </RouteGuard>
            } />
            <Route path="/job-chat/:jobId/:recipientId" element={
              <RouteGuard>
                <JobChat />
              </RouteGuard>
            } />
            <Route path={ROUTES.CLIENT_MESSAGES} element={
              <RouteGuard allowedRoles={['ROLE_STUDENT']}>
                <ChatsStudents />
              </RouteGuard>
            } />
            <Route path="/client-chat/:jobId/:recipientId" element={
              <RouteGuard>
                <JobChatStudents />
              </RouteGuard>
            } />
            <Route path={ROUTES.COINS} element={
              <RouteGuard>
                <Coins />
              </RouteGuard>
            } />
            <Route path={ROUTES.WALLET} element={
              <RouteGuard>
                <Wallet />
              </RouteGuard>
            } />
            <Route path={ROUTES.TUTORS} element={
              <RouteGuard>
                <Tutors />
              </RouteGuard>
            } />
            <Route path={ROUTES.MESSAGES2} element={
              <RouteGuard>
                <Messages />
              </RouteGuard>
            } />
            <Route path={ROUTES.COMPLETE} element={
              <RouteGuard>
                <SuccessPage />
              </RouteGuard>
            } />
            
            {/* Fallback route for old profile links */}
            <Route path="/profile" element={<Navigate to="/login" replace />} />
            
            {/* Fallback route */}
            <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Router>
  );
}

export default App;
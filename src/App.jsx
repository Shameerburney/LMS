import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { initDB } from './services/db';
import courseService from './services/courses';
import Layout from './components/layout/Layout';
import AIChatbot from './components/AIChatbot';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Student pages
import Dashboard from './pages/student/Dashboard';
import CourseLibrary from './pages/student/CourseLibrary';
import CourseDetail from './pages/student/CourseDetail';
import LessonView from './pages/student/LessonView';
import Progress from './pages/student/Progress';
import Certificates from './pages/student/Certificates';
import Profile from './pages/student/Profile';

// Instructor pages
import InstructorDashboard from './pages/instructor/InstructorDashboard';
import CreateCourse from './pages/instructor/CreateCourse';
import CreateQuiz from './pages/instructor/CreateQuiz';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import Announcements from './pages/admin/Announcements';

// Shared pages
import Forum from './pages/shared/Forum';
import ThreadView from './components/forum/ThreadView';
import TakeQuiz from './components/quiz/TakeQuiz';

// Wrapper for TakeQuiz to handle params
const TakeQuizWrapper = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    return <TakeQuiz quizId={id} studentId={user.id} onComplete={() => navigate(-1)} />;
};

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" />;
    }

    return (
        <Layout>
            {children}
            <AIChatbot />
        </Layout>
    );
};

function AppContent() {
    useEffect(() => {
        initDB();
        courseService.initializeSampleData();
    }, []);

    const { user } = useAuth();

    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
                <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />

                {/* Student Routes */}
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/courses" element={<ProtectedRoute><CourseLibrary /></ProtectedRoute>} />
                <Route path="/course/:id" element={<ProtectedRoute><CourseDetail /></ProtectedRoute>} />
                <Route path="/lesson/:id" element={<ProtectedRoute><LessonView /></ProtectedRoute>} />
                <Route path="/progress" element={<ProtectedRoute><Progress /></ProtectedRoute>} />
                <Route path="/certificates" element={<ProtectedRoute><Certificates /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

                {/* Instructor Routes */}
                <Route
                    path="/instructor"
                    element={<ProtectedRoute allowedRoles={['instructor', 'admin']}><InstructorDashboard /></ProtectedRoute>}
                />
                <Route
                    path="/instructor/create-course"
                    element={<ProtectedRoute allowedRoles={['instructor', 'admin']}><CreateCourse /></ProtectedRoute>}
                />
                <Route
                    path="/instructor/create-quiz"
                    element={<ProtectedRoute allowedRoles={['instructor', 'admin']}><CreateQuiz /></ProtectedRoute>}
                />

                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>}
                />
                <Route
                    path="/announcements"
                    element={<ProtectedRoute allowedRoles={['admin', 'instructor']}><Announcements /></ProtectedRoute>}
                />

                {/* Shared Routes */}
                <Route path="/forum" element={<ProtectedRoute><Forum /></ProtectedRoute>} />
                <Route path="/forum/:id" element={<ProtectedRoute><ThreadView /></ProtectedRoute>} />
                <Route path="/quiz/:id" element={<ProtectedRoute><TakeQuizWrapper /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <AppContent />
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;

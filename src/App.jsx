import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Anggota from './pages/Anggota';
import AboutClass from './pages/AboutClass';
import AdminDashboard from './pages/AdminDashboard';
import Galeri from './pages/Galeri';
import Kontak from './pages/Kontak';
import Login from './pages/Login';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';  
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Chatbot from './components/Chatbot';
import ErrorPage from './pages/ErrorPage';
import EmailVerification from './components/EmailVerification';
import ResetPassword from './components/ResetPassword';
import AdminProfile from './pages/AdminProfile';
import Help from './pages/Help';

function AppRoutes() {
  const { currentUser, isAdmin } = useAuth();
  const location = useLocation();
  
  return (
    <Routes location={location} key={location.pathname}>
      {/* Public routes */}
      <Route 
        path="/" 
        element={!currentUser ? <Login /> : <Navigate to="/home" replace />} 
      />
      
      <Route 
        path="/login" 
        element={!currentUser ? <Login /> : <Navigate to="/home" replace />} 
      />
      
      <Route 
        path="/verify-email" 
        element={<EmailVerification />} 
      />
      
      <Route 
        path="/reset-password" 
        element={<ResetPassword />} 
      />
      
      <Route 
        path="/error" 
        element={<ErrorPage />} 
      />
      
      {/* Protected routes */}
      <Route 
        path="/home" 
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/anggota" 
        element={
          <ProtectedRoute>
            <Anggota />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/about" 
        element={
          <ProtectedRoute>
            <AboutClass />
          </ProtectedRoute>
        } 
      />
      
      {/* Admin routes */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/admin-profile" 
        element={
          <ProtectedRoute requireAdmin={true}>
            <AdminProfile />
          </ProtectedRoute>
        } 
      />
      
      {/* User routes */}
      <Route 
        path="/galeri" 
        element={
          <ProtectedRoute>
            <Galeri />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/kontak" 
        element={
          <ProtectedRoute>
            <Kontak />
          </ProtectedRoute>
        } 
      />
      <Route 
        path="/help" 
        element={
          <ProtectedRoute>
            <Help />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/profile" 
        element={
          <ProtectedRoute>
            {isAdmin ? <AdminProfile /> : <Profile />}
          </ProtectedRoute>
        } 
      />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/error" replace />} />
    </Routes>
  );
}

function AppContent() {
  const { currentUser, isAdmin } = useAuth();
  const location = useLocation();
  
  // Hide navbar on these pages
  const hideNavbarPaths = ['/', '/login', '/verify-email', '/reset-password', '/error'];
  const hideNavbar = hideNavbarPaths.includes(location.pathname);
  
  // Hide chatbot on these pages
  const hideChatbotPaths = ['/', '/login', '/verify-email', '/reset-password', '/error', '/admin', '/admin-profile'];
  const hideChatbot = hideChatbotPaths.includes(location.pathname);
  
  return (
    <>
      {currentUser && !hideNavbar && <Navbar />}
      <main className={`${currentUser && !hideNavbar ? 'pt-16 pb-20' : ''}`}>
        <AppRoutes />
      </main>
      {currentUser && !hideChatbot && <Chatbot />}
      <div id="notification-root"></div>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
        <Router>
          <AppContent />
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
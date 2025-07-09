import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import HomePage from './pages/HomePage';
import SearchPage from './pages/SearchPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import UserDashboard from './pages/dashboard/UserDashboard';
import ProviderDashboard from './pages/dashboard/ProviderDashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import EvaluatorDashboard from './pages/dashboard/EvaluatorDashboard';
import { LanguageProvider } from './utils/translations';
import BlogPage from './pages/BlogPage';
import ExpertEvaluatorApplication from './pages/ExpertEvaluatorApplication';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { user } = useAuth();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/provider/dashboard"
          element={
            user && user.role === 'provider' ? (
              <ProviderDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            user && user.role === 'admin' ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/evaluator/dashboard"
          element={
            user && user.role === 'evaluator' ? (
              <EvaluatorDashboard />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/blog/:id" element={<BlogPage />} />
        <Route path="/expert-evaluator-application" element={<ExpertEvaluatorApplication />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
};

function App() {
  // Get initial language from localStorage user if available
  let initialLanguage = 'ar';
  try {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      if (user.language) initialLanguage = user.language;
    }
  } catch {}
  return (
    <LanguageProvider initialLanguage={initialLanguage as 'en' | 'de' | 'ar'}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
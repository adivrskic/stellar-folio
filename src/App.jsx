import { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';

// Layouts
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Eagerly loaded components
import LoadingScreen from './components/common/LoadingScreen';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import NotFoundPage from './pages/NotFoundPage';
import PricingPage from './pages/PricingPage';

// Lazily loaded components for better performance
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const UploadResumePage = lazy(() => import('./pages/UploadResumePage'));
const TemplateSelectPage = lazy(() => import('./pages/TemplateSelectPage'));
const PortfolioEditorPage = lazy(() => import('./pages/PortfolioEditorPage'));
const PortfolioPreviewPage = lazy(() => import('./pages/PortfolioPreviewPage'));
const DeploymentPage = lazy(() => import('./pages/DeploymentPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const PortfoliosPage = lazy(() => import('./pages/PortfoliosPage'));
const ThankYouPage = lazy(() => import('./pages/ThankYouPage'));

// Custom route that redirects to login if not authenticated
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  const { initAuth } = useAuth();
  
  useEffect(() => {
    // Initialize authentication
    initAuth();
  }, [initAuth]);
  
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="thank-you" element={<ThankYouPage />} />
        </Route>
        
        {/* Protected routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route index element={<DashboardPage />} />
          <Route path="upload" element={<UploadResumePage />} />
          <Route path="templates" element={<TemplateSelectPage />} />
          <Route path="editor/:id" element={<PortfolioEditorPage />} />
          <Route path="preview/:id" element={<PortfolioPreviewPage />} />
          <Route path="deploy/:id" element={<DeploymentPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="portfolios" element={<PortfoliosPage />} />
        </Route>
        
        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;
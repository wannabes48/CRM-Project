import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Link } from 'react-router-dom';
import ProtectedRoute from './components/routing/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import PipelinePage from './pages/PipelinePage';
import ContactsPage from './pages/ContactsPage';
import TicketsPage from './pages/TicketsPage';
import CalendarPage from './pages/CalendarPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PricingPage from './pages/PricingPage';
import BlogTemplate from './pages/BlogTemplate';
import ContentPage from './pages/ContentPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import IntegrationsPage from './pages/IntegrationsPage';
import SecurityPage from './pages/SecurityPage';
import SuccessPage from './pages/SuccessPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ContactDetailPage from './pages/ContactDetailPage';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/blog/sales-automation" element={<BlogTemplate />} />
          <Route path="/privacy" element={<ContentPage />} />
          <Route path="/terms" element={<ContentPage />} />
          <Route path="/cookie-policy" element={<ContentPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/integrations" element={<IntegrationsPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/security" element={<SecurityPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected CRM Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/contacts/:id" element={<ContactDetailPage />} />
              <Route path="/pipeline" element={<PipelinePage />} />
              <Route path="/tickets" element={<TicketsPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>
          <Route path="*" element={
          <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAFAFA]">
            <h1 className="text-6xl font-black text-gray-900 mb-4">404</h1>
            <p className="text-gray-500 mb-8 font-bold">Page not found.</p>
            <Link to="/" className="bg-[#064E3B] text-white px-6 py-3 rounded-xl font-bold">Go Home</Link>
          </div>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
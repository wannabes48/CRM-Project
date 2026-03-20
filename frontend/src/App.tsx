import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
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

          {/* Protected CRM Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/contacts" element={<ContactsPage />} />
              <Route path="/pipeline" element={<PipelinePage />} />
              <Route path="/tickets" element={<TicketsPage />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Route>
          
        </Routes>
      </AuthProvider>
    </Router>
  );
}
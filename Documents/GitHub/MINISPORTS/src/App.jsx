import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import CheckEmail from './pages/auth/CheckEmail';
import DashboardLayout from './components/DashboardLayout';
import Dashboard from './pages/Dashboard';
import { DarkModeProvider } from './contexts/DarkModeContext';
import { AuthProvider } from './contexts/AuthContext';
import SportsProfessionals from "./pages/SportsProfessionals";
import Partners from "./pages/Partners";
import ProtectedRoute from './components/ProtectedRoute';
import NationalTeams from './pages/NationalTeams';
import Employee from './pages/Employee';
import Appointments from './pages/Appointments';
import Training from './pages/Training';
import IsongaPrograms from './pages/IsongaPrograms';
import PlayerTransferReport from './components/reports/PlayerTransferReport';
import Federations from "./pages/Federations";
import { ThemeProvider } from './context/ThemeContext';
import SportsForAll from './pages/SportsForAll';
import Users from './pages/Users';
import Contracts from './pages/Contracts';
import Documents from './pages/Documents';
import Academies from './pages/Academies';
import { Toaster } from 'sonner';
import Settings from './pages/Settings';
import { UNSAFE_DataRouterContext, UNSAFE_DataRouterStateContext } from 'react-router-dom';
import Reports from './pages/Reports';
import Infrastructure from './pages/Infrastructure';
import { InfrastructureProvider } from './contexts/InfrastructureContext';
import SportsTourism from './pages/SportsTourism';
import { TourismProvider } from './contexts/TourismContext';
import EventsPage from './pages/public/EventsPage';
import { MatchOperatorDashboard, MatchScoreboard, TeamManagement } from './features/match-operator';

function App() {
  return (
    <ThemeProvider>
      <DarkModeProvider>
        <InfrastructureProvider>
          <TourismProvider>
            <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
              <AuthProvider>
                <Toaster position="top-right" richColors />
                <Routes>
                  {/* Public Routes */}
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/check-email" element={<CheckEmail />} />
                  <Route path="/landing" element={<LandingPage />} />
                  <Route path="/events" element={<EventsPage />} />
                  
                  {/* Protected Routes */}
                  <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/national-teams" element={<NationalTeams />} />
                    <Route path="/federations" element={<Federations />} />
                    <Route path="/sports-professionals" element={<SportsProfessionals />} />
                    <Route path="/trainings" element={<Training />} />
                    <Route path="/isonga-programs" element={<IsongaPrograms />} />
                    <Route path="/academies" element={<Academies />} />
                    <Route path="/infrastructure" element={<Infrastructure />} />
                    <Route path="/sports-tourism" element={<SportsTourism />} />
                    <Route path="/documents" element={<Documents />} />
                    <Route path="/contracts" element={<Contracts />} />
                    <Route path="/appointments" element={<Appointments />} />
                    <Route path="/employee" element={<Employee />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/partners" element={<Partners />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/sports-for-all" element={<SportsForAll />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/player-transfer-report" element={<PlayerTransferReport />} />
                    <Route path="/reports/sports-professionals" element={<Reports />} />
                    <Route path="/reports/isonga-program" element={<Reports />} />
                    <Route path="/reports/infrastructure" element={<Reports />} />
                    <Route path="/match-operator">
                      <Route index element={<MatchOperatorDashboard />} />
                      <Route path="matches/:matchId" element={<MatchScoreboard />} />
                      <Route path="teams" element={<TeamManagement />} />
                    </Route>
                  </Route>
                  
                  {/* Fallback Route */}
                  <Route path="*" element={<Navigate to="/landing" replace />} />
                </Routes>
              </AuthProvider>
            </Router>
          </TourismProvider>
        </InfrastructureProvider>
      </DarkModeProvider>
    </ThemeProvider>
  );
}

export default App; 
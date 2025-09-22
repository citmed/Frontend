import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import RegisterAdmin from './components/RegisterAdmin';
import AdminDashboard from './components/AdminDashboard';
import LandingPage from './components/LandinPage';
import Home from './components/Home';
import Reminder from './components/Reminder';
import Followup from './components/Followup';
import Remindercontrol from './components/Remindercontrol';
import ReminderMedicine from './components/ReminderMedicine';
import ReminderFrequency from './components/ReminderFrequency';
import ReminderCreated from './components/ReminderCreated';
import UserProfile from "./components/userProfile";
import ForgotPassword from "./components/ForgotPassword";   
import ResetPassword from "./components/ResetPassword";     
import EditReminder from './components/EditReminder';
import RecoverUsername from './components/RecoverUsername';

import './App.css';

// ✅ Funciones fuera del render
const getTokenPayload = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    return JSON.parse(atob(token.split('.')[1]));
  } catch (err) {
    return null;
  }
};

const isLoggedIn = () => {
  const payload = getTokenPayload();
  return !!payload?.userId;
};

const isAdmin = () => {
  const payload = getTokenPayload();
  return payload?.role === 'admin';
};

// ✅ Componente reutilizable para rutas privadas
const ProtectedRoute = ({ children, adminOnly = false }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/home" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-admin" element={<RegisterAdmin />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/edit-reminder/:id" element={<EditReminder />} />
          <Route path="/recover-username" element={<RecoverUsername />} />

          {/* Redirección lógica del dashboard */}
          <Route
            path="/dashboard"
            element={
              isLoggedIn() ? (
                isAdmin() ? (
                  <Navigate to="/admin/dashboard" replace />
                ) : (
                  <Navigate to="/home" replace />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* Rutas protegidas */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reminder"
            element={
              <ProtectedRoute>
                <Reminder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/follow-up"
            element={
              <ProtectedRoute>
                <Followup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create-reminder"
            element={
              <ProtectedRoute>
                <Remindercontrol />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reminder-medicine"
            element={
              <ProtectedRoute>
                <ReminderMedicine />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reminder-frequency"
            element={
              <ProtectedRoute>
                <ReminderFrequency />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reminder-created"
            element={
              <ProtectedRoute>
                <ReminderCreated />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

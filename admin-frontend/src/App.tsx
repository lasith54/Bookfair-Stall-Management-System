import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import StallsPage from './pages/StallsPage';
import ReservationsPage from './pages/ReservationsPage';
import UsersPage from './pages/UsersPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={
                <HomePage />
            } />
            <Route path="/stalls" element={
              <ProtectedRoute>
                <StallsPage />
              </ProtectedRoute>
            } />
            <Route path="/reservations" element={
              <ProtectedRoute>
                <ReservationsPage />
              </ProtectedRoute>
            } />
            <Route path="/users" element={
              <ProtectedRoute>
                <UsersPage />
              </ProtectedRoute>
            } />
          </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
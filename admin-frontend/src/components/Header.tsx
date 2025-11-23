import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Settings, LogOut, User } from 'lucide-react';

interface HeaderProps {
  title?: string;
}

export default function Header({ title = "Admin Dashboard" }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-lg border-b-2 border-blue-100">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-950 hover:text-blue-800 transition-colors">
              {title}
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            {user && (
              <>
                <Link to="/" className="text-gray-700 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Dashboard
                </Link>
                <Link to="/stalls" className="text-gray-700 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Stalls
                </Link>
                <Link to="/reservations" className="text-gray-700 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Reservations
                </Link>
                <Link to="/users" className="text-gray-700 hover:text-blue-700 hover:bg-blue-50 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                  Users
                </Link>
              </>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2 bg-blue-50 px-3 py-2 rounded-lg">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-800 font-medium">
                    {user.name}
                  </span>
                </div>
                <Button variant="ghost" size="sm" className="hover:bg-blue-50 hover:text-blue-700">
                  <Settings className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="hover:bg-red-50 hover:text-red-700">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <div className="space-x-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm" className="bg-blue-800 text-white hover:bg-blue-900">
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
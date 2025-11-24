import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Users, FileText, Settings, BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 w-full">
      <Header />
      <main className="w-full px-4 sm:px-6 lg:px-8 py-16">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-blue-950 mb-4">
              Book Fair Admin Dashboard
            </h1>
            {user ? (
              <div>
                <p className="text-xl text-gray-700 mb-2">
                  Welcome back, {user.name}!
                </p>
                <p className="text-lg text-blue-600 font-medium">
                  Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </p>
              </div>
            ) : (
              <p className="text-xl text-gray-700">
                Please sign in to access the administration panel
              </p>
            )}
          </div>
        </div>

        {user ? (
          /* Admin Dashboard Content */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Quick Stats Cards */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Stalls</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Reservations</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center">
                <Settings className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Active Stalls</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Guest Content */
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-3xl font-bold text-blue-950 mb-4">
              Administrator Access Required
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              This dashboard is for authorized administrators and employees only.
              Please sign in with your admin credentials to continue.
            </p>
            <div className="space-x-4">
              <Button size="lg" className="text-lg px-8 py-4 bg-blue-800 hover:bg-blue-900" onClick={handleSignIn}>
                Sign In
              </Button>
            </div>
          </div>
        )}

        {user && (
          /* Quick Actions */
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-blue-950 mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Button variant="outline" className="h-24 text-left border-2 hover:border-blue-500 hover:bg-blue-50" onClick={() => navigate('/users')}>
                <div>
                  <p className="font-semibold text-lg">Manage Users</p>
                  <p className="text-sm text-gray-600">View and manage user accounts</p>
                </div>
              </Button>
              
              <Button variant="outline" className="h-24 text-left border-2 hover:border-blue-500 hover:bg-blue-50" onClick={() => navigate('/stalls')}>
                <div>
                  <p className="font-semibold text-lg">Manage Stalls</p>
                  <p className="text-sm text-gray-600">Configure stall availability</p>
                </div>
              </Button>
              
              <Button variant="outline" className="h-24 text-left border-2 hover:border-blue-500 hover:bg-blue-50" onClick={() => navigate('/reservations')}>
                <div>
                  <p className="font-semibold text-lg">View Reservations</p>
                  <p className="text-sm text-gray-600">Manage booking requests</p>
                </div>
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
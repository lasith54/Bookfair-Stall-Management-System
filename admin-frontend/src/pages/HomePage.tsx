import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Users, FileText, Settings, BarChart3 } from 'lucide-react';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Book Fair Admin Dashboard
            </h1>
            {user ? (
              <div>
                <p className="text-xl text-gray-600 mb-2">
                  Welcome back, {user.name}!
                </p>
                <p className="text-gray-500">
                  Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </p>
              </div>
            ) : (
              <p className="text-xl text-gray-600">
                Please sign in to access the administration panel
              </p>
            )}
          </div>
        </div>

        {user ? (
          /* Admin Dashboard Content */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Quick Stats Cards */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Total Stalls</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-600">Reservations</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
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
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Administrator Access Required
            </h2>
            <p className="text-gray-600 mb-6">
              This dashboard is for authorized administrators and employees only.
              Please sign in with your admin credentials to continue.
            </p>
            <div className="space-x-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Sign In
              </Button>
            </div>
          </div>
        )}

        {user && (
          /* Quick Actions */
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 text-left">
                <div>
                  <p className="font-semibold">Manage Users</p>
                  <p className="text-sm text-gray-600">View and manage user accounts</p>
                </div>
              </Button>
              
              <Button variant="outline" className="h-20 text-left">
                <div>
                  <p className="font-semibold">Manage Stalls</p>
                  <p className="text-sm text-gray-600">Configure stall availability</p>
                </div>
              </Button>
              
              <Button variant="outline" className="h-20 text-left">
                <div>
                  <p className="font-semibold">View Reports</p>
                  <p className="text-sm text-gray-600">Generate system reports</p>
                </div>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
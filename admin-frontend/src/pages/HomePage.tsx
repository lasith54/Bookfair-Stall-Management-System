import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/button';
import { Users, FileText, Settings, BarChart3, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { useEffect, useState } from 'react';
import { dashboardService } from '../services/dashboardService';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStalls: 0,
    totalReservations: 0,
    availableStalls: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const [stallStats, reservationData, userStats] = await Promise.all([
        dashboardService.getStallStatistics(),
        dashboardService.getReservationStatistics(),
        dashboardService.getUserStats(),
      ]);

      setStats({
        totalUsers: userStats.totalUsers,
        totalStalls: stallStats.overview.total,
        totalReservations: reservationData.statistics?.total || reservationData.reservations.length,
        availableStalls: stallStats.overview.available,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 w-full">
      <Header />
      <main className="w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl shadow-2xl p-10 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-3">
                CIBF Admin Dashboard
              </h1>
              {user ? (
                <div>
                  <p className="text-xl text-blue-100 mb-1">
                    Welcome back, <span className="font-semibold">{user.name}</span>!
                  </p>
                  <p className="text-sm text-blue-200 flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-800 rounded-full">
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </span>
                  </p>
                </div>
              ) : (
                <p className="text-xl text-blue-100">
                  Please sign in to access the administration panel
                </p>
              )}
            </div>
            <TrendingUp className="h-20 w-20 text-blue-300 opacity-50" />
          </div>
        </div>

        {user ? (
          /* Admin Dashboard Content */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Quick Stats Cards */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{loading ? '--' : stats.totalUsers}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Stalls</p>
                  <p className="text-3xl font-bold text-gray-900">{loading ? '--' : stats.totalStalls}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <FileText className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-purple-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Reservations</p>
                  <p className="text-3xl font-bold text-gray-900">{loading ? '--' : stats.totalReservations}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-orange-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Available Stalls</p>
                  <p className="text-3xl font-bold text-gray-900">{loading ? '--' : stats.availableStalls}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Settings className="h-8 w-8 text-orange-600" />
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
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-blue-950 mb-6 flex items-center gap-2">
              Quick Actions
              <ArrowRight className="h-6 w-6 text-blue-600" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button 
                onClick={() => navigate('/users')}
                className="group bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 text-left border-2 border-blue-200 hover:border-blue-500 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <Users className="h-10 w-10 text-blue-600" />
                  <ArrowRight className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="font-bold text-xl text-gray-900 mb-1">Manage Users</p>
                <p className="text-sm text-gray-600">View and manage user accounts</p>
              </button>
              
              <button 
                onClick={() => navigate('/stalls')}
                className="group bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 text-left border-2 border-green-200 hover:border-green-500 hover:shadow-lg transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <FileText className="h-10 w-10 text-green-600" />
                  <ArrowRight className="h-5 w-5 text-green-600 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="font-bold text-xl text-gray-900 mb-1">View Stalls</p>
                <p className="text-sm text-gray-600">View reservations & stall availability</p>
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
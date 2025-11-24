import { useState, useEffect } from 'react';
import Header from '../components/Header';
import { Users, UserPlus, Shield, Settings, Search, Filter, Download, RefreshCw } from 'lucide-react';
import { Button } from '../components/ui/button';
import userService, { User, UserStats, CreateUserData } from '../services/userService';
import CreateUserModal from '../components/CreateUserModal';
import UsersTable from '../components/UsersTable';
import UserDetailsModal from '../components/UserDetailsModal';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function UsersPage() {
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load users and stats
  const loadUsers = async (page = 1, search = '', role = 'all', status = 'all') => {
    try {
      setError(null);
      const params: any = {
        page,
        limit: 10,
      };

      if (search) params.search = search;
      if (role !== 'all') params.role = role;
      if (status !== 'all') {
        params.isActive = status === 'active';
      }

      const response = await userService.getAllUsers(params);
      setUsers(response.users);
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (error: any) {
      console.error('Load users error:', error);
      
      // Handle authentication errors
      if (error.response?.status === 401) {
        setError('Your session has expired. Please login again.');
        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (error.message?.includes('Auth service is currently unavailable')) {
        setError('Authentication service is currently unavailable. Please try again later.');
      } else {
        setError(error.response?.data?.message || 'Failed to load users');
      }
    }
  };

  const loadUserStats = async () => {
    try {
      const stats = await userService.getUserStats();
      setUserStats(stats);
    } catch (error: any) {
      console.error('Load user stats error:', error);
      // Don't set error for stats failure, just log it
    }
  };

  // Initial load
  useEffect(() => {
    // Check if user is authenticated and has proper role
    if (!authLoading) {
      if (!user) {
        setError('You must be logged in to access this page.');
        navigate('/login');
        return;
      }
      
      if (user.role !== 'admin' && user.role !== 'employee') {
        setError('You do not have permission to access this page.');
        navigate('/');
        return;
      }

      const initialLoad = async () => {
        setLoading(true);
        await Promise.all([
          loadUsers(1, searchTerm, roleFilter, statusFilter),
          loadUserStats(),
        ]);
        setLoading(false);
      };

      initialLoad();
    }
  }, [user, authLoading, navigate]);

  // Handle search and filters
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadUsers(1, searchTerm, roleFilter, statusFilter);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, roleFilter, statusFilter]);

  // Handle page change
  const handlePageChange = (page: number) => {
    loadUsers(page, searchTerm, roleFilter, statusFilter);
    setCurrentPage(page);
  };

  // Create user
  const handleCreateUser = async (userData: CreateUserData) => {
    try {
      await userService.createUser(userData);
      await Promise.all([
        loadUsers(currentPage, searchTerm, roleFilter, statusFilter),
        loadUserStats(),
      ]);
    } catch (error: any) {
      console.error('Create user error:', error);
      throw error;
    }
  };

  // Toggle user status
  const handleToggleStatus = async (userId: string, isActive: boolean) => {
    try {
      await userService.toggleUserStatus(userId, isActive);
      await Promise.all([
        loadUsers(currentPage, searchTerm, roleFilter, statusFilter),
        loadUserStats(),
      ]);
    } catch (error: any) {
      console.error('Toggle status error:', error);
      setError(error.response?.data?.message || 'Failed to update user status');
    }
  };

  // Toggle user verification
  const handleToggleVerification = async (userId: string, isVerified: boolean) => {
    try {
      await userService.toggleUserVerification(userId, isVerified);
      await loadUsers(currentPage, searchTerm, roleFilter, statusFilter);
    } catch (error: any) {
      console.error('Toggle verification error:', error);
      setError(error.response?.data?.message || 'Failed to update user verification');
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      await userService.deleteUser(userId);
      await Promise.all([
        loadUsers(currentPage, searchTerm, roleFilter, statusFilter),
        loadUserStats(),
      ]);
    } catch (error: any) {
      console.error('Delete user error:', error);
      setError(error.response?.data?.message || 'Failed to delete user');
    }
  };

  // Refresh data
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      loadUsers(currentPage, searchTerm, roleFilter, statusFilter),
      loadUserStats(),
    ]);
    setIsRefreshing(false);
  };

  // Export users
  const handleExport = async () => {
    try {
      const blob = await userService.exportUsers('csv', {
        search: searchTerm,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        isActive: statusFilter !== 'all' ? statusFilter === 'active' : undefined,
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Export error:', error);
      setError(error.response?.data?.message || 'Failed to export users');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 w-full">
      <Header />
      
      <main className="w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Check if user is still loading */}
        {authLoading && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
            </div>
            <p className="text-gray-600 mt-4">Loading authentication...</p>
          </div>
        )}

        {/* Show error if authentication failed or no permission */}
        {!authLoading && (!user || (user.role !== 'admin' && user.role !== 'employee')) && (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-red-600 mb-4">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">
              {!user ? 'You must be logged in to access this page.' : 'You do not have permission to access this page.'}
            </p>
            <Button onClick={() => navigate(!user ? '/login' : '/')} className="bg-blue-800 hover:bg-blue-900">
              {!user ? 'Go to Login' : 'Go to Home'}
            </Button>
          </div>
        )}

        {/* Show content only if authenticated */}
        {!authLoading && user && (user.role === 'admin' || user.role === 'employee') && (
          <>
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-2xl shadow-2xl p-10 mb-8 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    Users Management
                  </h1>
                  <p className="text-lg text-blue-100">
                    Manage user accounts, roles, and permissions
                  </p>
                </div>
                <Users className="h-20 w-20 text-blue-300 opacity-50" />
              </div>
            </div>

        {/* Error Message */}
        {error && (
          <ErrorMessage 
            error={error} 
            onDismiss={() => setError(null)}
            className="mb-6"
          />
        )}
        
        {/* Stats Cards */}
        {userStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-blue-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{userStats.totalUsers}</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-green-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Admins & Employees</p>
                  <p className="text-3xl font-bold text-gray-900">{userStats.admins + userStats.employees}</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-purple-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Vendors & Publishers</p>
                  <p className="text-3xl font-bold text-gray-900">{userStats.vendors + userStats.publishers}</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow border-l-4 border-orange-600">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active</p>
                  <p className="text-3xl font-bold text-gray-900">{userStats.activeUsers}</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Settings className="h-8 w-8 text-orange-600" />
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Controls */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Role Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admin</option>
                  <option value="employee">Employee</option>
                  <option value="vendor">Vendor</option>
                  <option value="publisher">Publisher</option>
                </select>
              </div>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              
              <Button
                className="bg-blue-800 hover:bg-blue-900"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <UsersTable
          users={users}
          loading={loading}
          onEdit={(user) => {
            setSelectedUser(user);
            // TODO: Open edit modal
          }}
          onDelete={handleDeleteUser}
          onToggleStatus={handleToggleStatus}
          onToggleVerification={handleToggleVerification}
          onViewDetails={(user) => {
            setSelectedUser(user);
            setIsDetailsModalOpen(true);
          }}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
            <div className="flex justify-center">
              <nav className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  Previous
                </Button>
                
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const page = Math.max(1, currentPage - 2) + i;
                  if (page > totalPages) return null;
                  
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                      className={currentPage === page ? "bg-blue-800 hover:bg-blue-900" : ""}
                    >
                      {page}
                    </Button>
                  );
                })}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  Next
                </Button>
              </nav>
            </div>
            
            <p className="text-center text-sm text-gray-500 mt-4">
              Showing page {currentPage} of {totalPages}
            </p>
          </div>
        )}
        </>
        )}
      </main>

      {/* Modals */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
        isLoading={false}
      />

      <UserDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        user={selectedUser}
      />
    </div>
  );
}
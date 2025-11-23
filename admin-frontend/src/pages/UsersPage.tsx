import Header from '../components/Header';
import { Users, UserPlus, Shield, Settings } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function UsersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 w-full">
      <Header />
      
      <main className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-blue-950 mb-4 text-center">
            Users Management
          </h1>
          <p className="text-lg text-gray-700 text-center">
            Manage user accounts, roles, and permissions
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <Shield className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Exhibitors</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-950">User Management Features</h2>
            <Button className="bg-blue-800 hover:bg-blue-900" size="lg">
              <UserPlus className="h-4 w-4 mr-2" />
              Add New User
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                View All Users
              </h4>
              <p className="text-gray-600 mb-4">
                Browse and search through all registered users in the system.
              </p>
              <Button variant="outline" className="border-blue-500 text-blue-700 hover:bg-blue-100">
                View Users
              </Button>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
              <Shield className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Manage Roles & Permissions
              </h4>
              <p className="text-gray-600 mb-4">
                Assign roles and configure user permissions for the system.
              </p>
              <Button variant="outline" className="border-green-500 text-green-700 hover:bg-green-100">
                Manage Roles
              </Button>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200">
              <UserPlus className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Add Admin Users
              </h4>
              <p className="text-gray-600 mb-4">
                Create new administrator accounts with appropriate access.
              </p>
              <Button variant="outline" className="border-purple-500 text-purple-700 hover:bg-purple-100">
                Add Admin
              </Button>
            </div>
            
            <div className="text-center p-6 bg-orange-50 rounded-lg border border-orange-200">
              <Settings className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Account Management
              </h4>
              <p className="text-gray-600 mb-4">
                Activate, deactivate, or modify user account settings.
              </p>
              <Button variant="outline" className="border-orange-500 text-orange-700 hover:bg-orange-100">
                Manage Accounts
              </Button>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
              <Users className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                User Activity
              </h4>
              <p className="text-gray-600 mb-4">
                Monitor user activity and login history across the platform.
              </p>
              <Button variant="outline" className="border-gray-500 text-gray-700 hover:bg-gray-100">
                View Activity
              </Button>
            </div>
            
            <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
              <Shield className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Security Settings
              </h4>
              <p className="text-gray-600 mb-4">
                Configure security policies and password requirements.
              </p>
              <Button variant="outline" className="border-red-500 text-red-700 hover:bg-red-100">
                Security
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
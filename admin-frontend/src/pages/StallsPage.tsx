import Header from '../components/Header';
import { MapPin, Plus, Edit, Eye, Settings, BarChart3 } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function StallsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 w-full">
      <Header />
      
      <main className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-blue-950 mb-4 text-center">
            Stalls Management
          </h1>
          <p className="text-lg text-gray-700 text-center">
            Configure and manage exhibition stalls for the Book Fair
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <MapPin className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Stalls</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Reserved</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <Edit className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">In Use</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-950">Stall Management Features</h2>
            <Button className="bg-blue-800 hover:bg-blue-900" size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Add New Stall
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
              <Eye className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                View All Stalls
              </h4>
              <p className="text-gray-600 mb-4">
                Browse through all exhibition stalls with detailed information.
              </p>
              <Button variant="outline" className="border-blue-500 text-blue-700 hover:bg-blue-100">
                View Stalls
              </Button>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
              <Plus className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Add New Stalls
              </h4>
              <p className="text-gray-600 mb-4">
                Create new stall entries with location and pricing details.
              </p>
              <Button variant="outline" className="border-green-500 text-green-700 hover:bg-green-100">
                Add Stalls
              </Button>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200">
              <Edit className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Edit Stall Details
              </h4>
              <p className="text-gray-600 mb-4">
                Modify stall information, pricing, and specifications.
              </p>
              <Button variant="outline" className="border-purple-500 text-purple-700 hover:bg-purple-100">
                Edit Details
              </Button>
            </div>
            
            <div className="text-center p-6 bg-orange-50 rounded-lg border border-orange-200">
              <Settings className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Manage Availability
              </h4>
              <p className="text-gray-600 mb-4">
                Control stall availability and booking status.
              </p>
              <Button variant="outline" className="border-orange-500 text-orange-700 hover:bg-orange-100">
                Manage Status
              </Button>
            </div>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-200">
              <MapPin className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Hall Layout
              </h4>
              <p className="text-gray-600 mb-4">
                View and manage the overall hall layout and stall positions.
              </p>
              <Button variant="outline" className="border-gray-500 text-gray-700 hover:bg-gray-100">
                View Layout
              </Button>
            </div>
            
            <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
              <BarChart3 className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Stall Analytics
              </h4>
              <p className="text-gray-600 mb-4">
                View usage statistics and performance metrics for stalls.
              </p>
              <Button variant="outline" className="border-red-500 text-red-700 hover:bg-red-100">
                View Analytics
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
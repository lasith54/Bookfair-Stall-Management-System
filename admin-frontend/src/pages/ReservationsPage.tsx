import Header from '../components/Header';
import { Calendar, CheckCircle, XCircle, Clock, AlertTriangle, FileText } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function ReservationsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 w-full">
      <Header />
      
      <main className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-4xl font-bold text-blue-950 mb-4 text-center">
            Reservations Management
          </h1>
          <p className="text-lg text-gray-700 text-center">
            Monitor, approve, and manage all stall reservation requests
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center">
              <XCircle className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-gray-900">--</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="bg-white shadow-lg rounded-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-blue-950">Reservation Management Features</h2>
            <Button className="bg-blue-800 hover:bg-blue-900" size="lg">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg border border-blue-200">
              <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                View All Reservations
              </h4>
              <p className="text-gray-600 mb-4">
                Browse through all reservation requests with filtering options.
              </p>
              <Button variant="outline" className="border-blue-500 text-blue-700 hover:bg-blue-100">
                View Reservations
              </Button>
            </div>
            
            <div className="text-center p-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <Clock className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Pending Approvals
              </h4>
              <p className="text-gray-600 mb-4">
                Review and process reservation requests awaiting approval.
              </p>
              <Button variant="outline" className="border-yellow-500 text-yellow-700 hover:bg-yellow-100">
                Review Pending
              </Button>
            </div>
            
            <div className="text-center p-6 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Approve Reservations
              </h4>
              <p className="text-gray-600 mb-4">
                Quick approval workflow for valid reservation requests.
              </p>
              <Button variant="outline" className="border-green-500 text-green-700 hover:bg-green-100">
                Approve Requests
              </Button>
            </div>
            
            <div className="text-center p-6 bg-red-50 rounded-lg border border-red-200">
              <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Reject Reservations
              </h4>
              <p className="text-gray-600 mb-4">
                Handle rejection of invalid or conflicting requests.
              </p>
              <Button variant="outline" className="border-red-500 text-red-700 hover:bg-red-100">
                Manage Rejections
              </Button>
            </div>
            
            <div className="text-center p-6 bg-orange-50 rounded-lg border border-orange-200">
              <AlertTriangle className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Handle Conflicts
              </h4>
              <p className="text-gray-600 mb-4">
                Resolve reservation conflicts and overlapping requests.
              </p>
              <Button variant="outline" className="border-orange-500 text-orange-700 hover:bg-orange-100">
                Resolve Conflicts
              </Button>
            </div>
            
            <div className="text-center p-6 bg-purple-50 rounded-lg border border-purple-200">
              <FileText className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Modify Details
              </h4>
              <p className="text-gray-600 mb-4">
                Update reservation information and booking details.
              </p>
              <Button variant="outline" className="border-purple-500 text-purple-700 hover:bg-purple-100">
                Modify Bookings
              </Button>
            </div>
          </div>
        </div>
        
        {/* Recent Activity */}
        <div className="mt-8 bg-gray-900 text-white rounded-lg shadow-lg p-8">
          <h3 className="text-2xl font-bold mb-6 text-center">Recent Reservation Activity</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">Today</div>
              <div className="text-gray-300">New Requests: --</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">This Week</div>
              <div className="text-gray-300">Approved: --</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">Pending</div>
              <div className="text-gray-300">Awaiting Review: --</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
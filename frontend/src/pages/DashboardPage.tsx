import { useAuth } from "../../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Users, MapPin, BarChart3, Calendar, FileText, Settings } from "lucide-react";
import cibfLogo from "@/assets/CIBF-Logo-Web.png";
import cibfBackground from "@/assets/Colombo-International-Book-Fair-2023-.jpg";

export default function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 w-full">
      {/* Header */}
      <header className="bg-white shadow-sm w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <img 
                src={cibfLogo} 
                alt="CIBF Logo" 
                className="h-16 w-auto"
              />
              <div className="flex flex-col">
                <h1 className="text-xl text-blue-800 leading-tight">
                  Colombo International
                </h1>
                <h2 className="text-3xl font-bold text-blue-800 leading-tight">
                  Book Fair - Dashboard
                </h2>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.name || user?.email}</span>
              <Button
                onClick={logout}
                variant="outline"
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white border-red-600"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-16">
        <div 
          className="text-center w-full bg-cover bg-center bg-no-repeat relative py-20 px-8 rounded-lg"
          style={{ backgroundImage: `url(${cibfBackground})` }}
        >
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>
          
          <div className="relative z-10">
            <h2 className="text-6xl font-bold text-white mb-4 drop-shadow-lg">
              STALL MANAGEMENT
            </h2>
            <div className="text-2xl text-white mb-6 drop-shadow-md">
              <p className="font-semibold">Book Fair 2025 Dashboard</p>
              <p>Manage your stall efficiently</p>
            </div>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-4 bg-blue-800 hover:bg-blue-900">
                Manage Stall
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-white text-blue-800 hover:bg-white hover:text-blue-800">
                View Analytics
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-white text-blue-800 hover:bg-white hover:text-blue-800">
                Hall Map
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Stats Section */}
        <div className="mt-20 w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-3xl font-bold text-blue-950 mb-6 text-center">
              Stall Management Overview
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6 text-center">
              Welcome to your stall management dashboard. Here you can monitor your booth performance, 
              manage inventory, track sales, and coordinate with the book fair organizers.
            </p>
          </div>
        </div>

        {/* Dashboard Features */}
        <div className="mt-20 w-full">
          <h3 className="text-3xl font-bold text-blue-950 mb-8 text-center">Dashboard Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <BarChart3 className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Sales Analytics
              </h4>
              <p className="text-gray-600">
                Track your daily sales, revenue trends, and performance metrics in real-time.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <FileText className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Inventory Management
              </h4>
              <p className="text-gray-600">
                Manage your book inventory, stock levels, and update product information.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Event Schedule
              </h4>
              <p className="text-gray-600">
                View upcoming events, book launches, and important announcements.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Stall Information
              </h4>
              <p className="text-gray-600">
                View your stall location, size, and facility details within the fair.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Customer Insights
              </h4>
              <p className="text-gray-600">
                Analyze visitor patterns and customer demographics for your stall.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
              <Settings className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Settings & Support
              </h4>
              <p className="text-gray-600">
                Configure your preferences and get support from fair organizers.
              </p>
            </div>
          </div>
        </div>

        {/* Event Details Section */}
        <div className="mt-20 bg-gray-900 text-white rounded-2xl shadow-lg p-8 w-full">
          <h3 className="text-3xl font-bold mb-8 text-center">Fair Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">27th Sep - 06th Oct</div>
              <div className="text-gray-300">2025</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">9.00 AM - 9.00 PM</div>
              <div className="text-gray-300">Daily Timings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">500+</div>
              <div className="text-gray-300">Exhibitors</div>
            </div>
          </div>
          <div className="text-center mt-6">
            <p className="text-lg text-blue-200">BMICH, Bauddhaloka Mawatha, Colombo 07</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Sri Lanka Book Publishers' Association
              </h3>
              <div className="text-gray-400 space-y-2">
                <p>No: 83, New Parliament Rd,</p>
                <p>Battaramulla, Sri Lanka</p>
                <p>Phone: +94 11 2785480</p>
                <p>Email: srilankabookpublishers@gmail.com</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="text-gray-400 space-y-2">
                <p><a href="#dashboard" className="hover:text-white">Dashboard</a></p>
                <p><a href="#analytics" className="hover:text-white">Analytics</a></p>
                <p><a href="#inventory" className="hover:text-white">Inventory</a></p>
                <p><a href="#settings" className="hover:text-white">Settings</a></p>
                <p><a href="#support" className="hover:text-white">Support</a></p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="text-gray-400 space-y-2">
                <p><a href="https://www.facebook.com/ColomboInternationalBookFair" className="hover:text-white">Facebook</a></p>
                <p><a href="#" className="hover:text-white">Instagram</a></p>
              </div>
              <div className="mt-6">
                <p className="text-sm text-gray-500">
                  Copyright ©2025 All rights reserved | Sri Lanka Book Publishers' Association
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
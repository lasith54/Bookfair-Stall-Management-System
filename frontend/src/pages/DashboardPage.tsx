import InteractiveVenueMap from "@/components/InteractiveVenueMap";
import Header from "@/components/Header";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 w-full overflow-x-hidden">
      <Header title="Book Fair" />

      {/* Main Content */}
      <main className="w-full px-4 sm:px-6 lg:px-8 py-16">
        {/* Interactive Venue Map */}
        <div className="w-full max-w-full">
          <InteractiveVenueMap />
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
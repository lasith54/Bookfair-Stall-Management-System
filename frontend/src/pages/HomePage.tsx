import { Button } from "@/components/ui/button";
import { Users, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import cibfLogo from "@/assets/CIBF-Logo-Web.png";
import cibfBackground from "@/assets/Colombo-International-Book-Fair-2023-.jpg";

export default function HomePage() {
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
                  Book Fair
                </h2>
              </div>
            </div>
            <div className="flex space-x-4">
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" className="bg-blue-800 hover:bg-blue-900">
                  Register
                </Button>
              </Link>
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
              BOOK FAIR 2025
            </h2>
            <div className="text-2xl text-white mb-6 drop-shadow-md">
              <p className="font-semibold">27th September to 06th October 2025</p>
              <p>9.00 AM to 9.00 PM</p>
            </div>
            <div className="text-xl text-white mb-8 drop-shadow-md">
              <p className="font-medium">Bandaranaike Memorial International Conference Hall – BMICH</p>
              <p>Bauddhaloka Mawatha, Colombo 07, Sri Lanka</p>
            </div>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-4 bg-blue-800 hover:bg-blue-900">
                Apply Now
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-white text-blue-800 hover:bg-white hover:text-blue-800">
                Contact Now
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-white text-blue-800 hover:bg-white hover:text-blue-800">
                Hall Map
              </Button>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-20 w-full">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-3xl font-bold text-blue-950 mb-6 text-center">
              About Colombo International Book Fair
            </h3>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              The Colombo International Book Fair (CIBF), the most popular annual book exhibition, 
              is set to celebrate its 25th anniversary in September 2024. This milestone event will 
              feature an array of literary and cultural activities, catering to children and readers 
              from all walks of life. This year's fair will host over 500 exhibitors, including 
              international participants, and will introduce thousands of new titles.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Originating in 1999 as a modest initiative by the Sri Lanka Book Publishers Association, 
              the CIBF has grown into a prestigious international event, marking significant achievements 
              for readers, authors, illustrators, editors, and translators alike.
            </p>
          </div>
        </div>

        {/* Events Section */}
        <div className="mt-20 w-full">
          <h3 className="text-3xl font-bold text-blue-950 mb-8 text-center">Events</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Book Launches
              </h4>
              <p className="text-gray-600">
                Discover new titles and meet authors during exciting book launch events throughout the fair.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Discussion Sessions with Writers
              </h4>
              <p className="text-gray-600">
                Engage in meaningful conversations with renowned authors and literary figures.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Musical Programs & Stage Dramas
              </h4>
              <p className="text-gray-600">
                Enjoy cultural performances including music and theatrical presentations.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                "Katapath Pawura"
              </h4>
              <p className="text-gray-600">
                A creative space where visitors can note their poems and verses.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Kids Activities
              </h4>
              <p className="text-gray-600">
                Painting, clay work, dramas, and puppet shows for children.
              </p>
            </div>
            
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Award Ceremonies
              </h4>
              <p className="text-gray-600">
                Swarnapusthaka and Rajathapusthaka Awards for literature excellence.
              </p>
            </div>
          </div>
        </div>

        {/* Event Details Section */}
        <div className="mt-20 bg-gray-900 text-white rounded-2xl shadow-lg p-8 w-full">
          <h3 className="text-3xl font-bold mb-8 text-center">Event Details</h3>
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
                <p><a href="#home" className="hover:text-white">Home</a></p>
                <p><a href="#about" className="hover:text-white">About</a></p>
                <p><a href="#events" className="hover:text-white">Events</a></p>
                <p><a href="#gallery" className="hover:text-white">Photo Gallery</a></p>
                <p><a href="#contact" className="hover:text-white">Contact</a></p>
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
import { Button } from "@/components/ui/button";
import { Users, MapPin, CalendarDays, LayoutPanelLeft, ClipboardList } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Header from "@/components/Header";
import { useNavigate } from "react-router-dom";
import HeroCarousel from "@/components/HeroCarousel";

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-[70vh] sm:min-h-[75vh] lg:min-h-[80vh] overflow-hidden">
      <Header title="Book Fair" />

      {/* HERO */}
<main className="w-full flex-1">
  <section className="relative w-full">
    {/* Hero container with full-height */}
    <div className="relative w-full h-[70vh] sm:h-[75vh] lg:h-[80vh] overflow-hidden">
      <HeroCarousel />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/10" />

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center px-2 sm:px-4 lg:px-6">
        <div className="max-w-6xl w-full mx-auto flex flex-col lg:flex-row items-center lg:items-stretch gap-8">

          {/* Left: Text */}
          <div className="flex-1 text-white text-center lg:text-left space-y-4 flex flex-col justify-center">
            <p className="inline-flex items-center gap-2 text-sm font-medium bg-white/10 px-3 py-1 rounded-full border border-white/20 backdrop-blur-sm mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Stall Booking Portal • Exhibitors Only
            </p>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight drop-shadow-xl">
              BOOK FAIR <span className="text-blue-200">2025</span>
            </h1>

            <div className="space-y-1 text-sm sm:text-base md:text-lg font-medium drop-shadow-md">
              <p>27th September – 06th October 2025</p>
              <p>9.00 AM – 9.00 PM (Daily)</p>
            </div>

            <div className="space-y-1 text-xs sm:text-sm md:text-base text-blue-100">
              <p>Bandaranaike Memorial International Conference Hall – BMICH</p>
              <p>Bauddhaloka Mawatha, Colombo 07, Sri Lanka</p>
            </div>

            {/* Primary CTAs */}
            <div className="mt-4 flex flex-col sm:flex-row gap-3 sm:items-center justify-center lg:justify-start">
              {user ? (
                <>
                  <Button
                    size="lg"
                    className="text-base sm:text-lg px-6 py-2 bg-blue-700 hover:bg-blue-800 shadow-lg shadow-blue-900/40"
                    onClick={() => navigate("/dashboard")}
                  >
                    Reserve Stall
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-base sm:text-lg px-6 py-2 border-white/70 text-black hover:bg-white/10 backdrop-blur-md"
                    onClick={() => navigate("/hall-map")}
                  >
                    View Hall Map
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    size="lg"
                    className="text-base sm:text-lg px-6 py-2 bg-blue-700 hover:bg-blue-800 shadow-lg shadow-blue-900/40"
                    onClick={() => navigate("/login")}
                  >
                    Exhibitor Login / Apply
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-base sm:text-lg px-6 py-2 border-white/70 text-black hover:bg-white/10 backdrop-blur-md"
                    onClick={() => navigate("/hall-map")}
                  >
                    Explore Hall Layout
                  </Button>
                </>
              )}
            </div>

            {/* Quick meta */}
            <div className="mt-3 flex flex-wrap gap-2 text-xs sm:text-sm text-blue-100/90 justify-center lg:justify-start">
              <span className="inline-flex items-center gap-1 rounded-full border border-white/25 px-2 py-1 bg-black/25 backdrop-blur-sm">
                <Users className="w-3 h-3" /> 500+ Exhibitors
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-white/25 px-2 py-1 bg-black/25 backdrop-blur-sm">
                <MapPin className="w-3 h-3" /> BMICH, Colombo 07
              </span>
            </div>
          </div>

          {/* Right: Glass info card */}
          <div className="w-full max-w-md mt-6 lg:mt-0 flex-shrink-0">
            <div className="rounded-2xl bg-white/90 backdrop-blur-md shadow-2xl border border-white/60 p-5 space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <h2 className="text-lg sm:text-xl font-semibold text-blue-950">
                  Stall Management at a Glance
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Manage your exhibition presence seamlessly – browse hall maps, pick
                  ideal stall locations, and track your booking status in one place.
                </p>
                <div className="grid grid-cols-3 gap-3 text-center text-xs sm:text-sm">
                  <div className="space-y-1">
                    <div className="text-base font-bold text-blue-700">500+</div>
                    <p className="text-gray-500">Exhibitors</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-base font-bold text-blue-700">10</div>
                    <p className="text-gray-500">Days</p>
                  </div>
                  <div className="space-y-1">
                    <div className="text-base font-bold text-blue-700">9AM–9PM</div>
                    <p className="text-gray-500">Open</p>
                  </div>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

                <div className="space-y-2 text-sm sm:text-base">
                  <p className="font-medium text-gray-800">Exhibitors can:</p>
                  <ul className="space-y-1 text-gray-600 list-disc list-inside">
                    <li>Browse real-time stall availability</li>
                    <li>Reserve and manage stall bookings</li>
                    <li>Download confirmations & invoices</li>
                  </ul>
                </div>
              </div>

              <Button
                className="w-full bg-blue-800 hover:bg-blue-900 mt-2"
                size="sm"
                onClick={() => (user ? navigate("/dashboard") : navigate("/login"))}
              >
                {user ? "Go to Stall Dashboard" : "Start Exhibitor Application"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>




        {/* For Exhibitors – quick actions */}
        <section className="w-full px-4 sm:px-6 lg:px-8 mt-10">
          <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md border border-blue-50 px-6 sm:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-blue-950">
                For Exhibitors
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Use the online portal to secure the best stall locations before they run out.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="border-blue-200 text-blue-900 hover:bg-blue-50"
                onClick={() => navigate("/hall-map")}
              >
                View Hall Map
              </Button>
              <Button
                className="bg-blue-700 hover:bg-blue-800"
                onClick={() => (user ? navigate("/dashboard") : navigate("/login"))}
              >
                {user ? "Manage My Stalls" : "Login to Apply"}
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="mt-16 w-full px-4 sm:px-6 lg:px-8" id="about">
          <div className="max-w-6xl mx-auto grid gap-10 lg:grid-cols-[1.2fr,1fr] items-start">
            <div className="bg-white rounded-2xl shadow-md p-8 border border-blue-50">
              <h3 className="text-3xl font-bold text-blue-950 mb-4">
                About Colombo International Book Fair
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                The Colombo International Book Fair (CIBF), the most popular annual book
                exhibition in Sri Lanka, is set to celebrate its 25th anniversary. This
                milestone event brings together publishers, authors, and readers under one
                roof with a rich programme of literary and cultural activities.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Originating in 1999 as a modest initiative by the Sri Lanka Book
                Publishers Association, CIBF has grown into a prestigious international
                event, creating opportunities for readers, authors, illustrators, editors,
                translators, and exhibitors to connect and grow.
              </p>
            </div>

            {/* Highlight card */}
            <div className="space-y-4">
              <div className="bg-indigo-900 text-white rounded-2xl shadow-lg p-6">
                <h4 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" />
                  Event Snapshot
                </h4>
                <ul className="space-y-2 text-sm">
                  <li>📅 27th September – 06th October 2025</li>
                  <li>📍 BMICH, Colombo 07</li>
                  <li>📚 500+ Exhibitors, thousands of new titles</li>
                  <li>👨‍👩‍👧 Open to all – readers, students, families & professionals</li>
                </ul>
              </div>
              <div className="bg-blue-50/80 border border-blue-100 rounded-2xl p-4 text-sm text-gray-700">
                Ideal for publishers, bookshops, educational institutes, and literary
                organizations looking to showcase their catalogues and engage directly
                with readers.
              </div>
            </div>
          </div>
        </section>

        {/* How Stall Booking Works */}
        <section
          className="mt-20 w-full px-4 sm:px-6 lg:px-8"
          aria-labelledby="how-it-works"
        >
          <div className="max-w-6xl mx-auto">
            <h3
              id="how-it-works"
              className="text-3xl font-bold text-blue-950 mb-6 text-center"
            >
              How Stall Booking Works
            </h3>
            <p className="text-center text-gray-600 max-w-2xl mx-auto mb-10">
              Use the Stall Management System to reserve, review, and manage your presence
              at the Colombo International Book Fair with minimal paperwork.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-2xl shadow-md p-6 border border-blue-50">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <ClipboardList className="w-5 h-5 text-blue-700" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  1. Create / Login Account
                </h4>
                <p className="text-sm text-gray-600">
                  Exhibitors sign in or apply online to access the booking portal and
                  manage their organization profile.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-md p-6 border border-blue-50">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <LayoutPanelLeft className="w-5 h-5 text-blue-700" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  2. Explore Hall Map
                </h4>
                <p className="text-sm text-gray-600">
                  Browse the interactive hall map, filter by zone or hall, and find the
                  stall that best fits your visibility and budget.
                </p>
              </div>
              <div className="bg-white rounded-2xl shadow-md p-6 border border-blue-50">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 text-blue-700" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-1">
                  3. Reserve & Manage
                </h4>
                <p className="text-sm text-gray-600">
                  Reserve your chosen stall, track approvals, and download confirmations
                  directly from your exhibitor dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Events Section */}
        <section className="mt-20 w-full px-4 sm:px-6 lg:px-8" id="events">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl font-bold text-blue-950 mb-8 text-center">
              Featured Events
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              <div className="text-center p-6 bg-white rounded-lg shadow-md border border-blue-50">
                <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Book Launches
                </h4>
                <p className="text-gray-600 text-sm">
                  Discover new titles and meet authors during curated launch events
                  throughout the fair.
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg shadow-md border border-blue-50">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Writer Discussions
                </h4>
                <p className="text-gray-600 text-sm">
                  Engage in conversations with renowned authors, critics, and literary
                  figures.
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg shadow-md border border-blue-50">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Cultural Performances
                </h4>
                <p className="text-gray-600 text-sm">
                  Enjoy musical programmes, stage dramas, and a vibrant cultural
                  atmosphere.
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg shadow-md border border-blue-50">
                <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  &quot;Katapath Pawura&quot;
                </h4>
                <p className="text-gray-600 text-sm">
                  A creative corner where visitors can share their poems and verses.
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg shadow-md border border-blue-50">
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Kids&apos; Zone
                </h4>
                <p className="text-gray-600 text-sm">
                  Painting, clay work, dramas, and puppet shows for young readers.
                </p>
              </div>

              <div className="text-center p-6 bg-white rounded-lg shadow-md border border-blue-50">
                <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Literary Awards
                </h4>
                <p className="text-gray-600 text-sm">
                  Swarnapusthaka and Rajathapusthaka Awards celebrating literary
                  excellence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Event Details Strip */}
        <section className="mt-20 w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto bg-gray-900 text-white rounded-2xl shadow-lg p-8 w-full">
            <h3 className="text-3xl font-bold mb-8 text-center">Event Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-400">
                  27th Sep – 06th Oct
                </div>
                <div className="text-gray-300">2025</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-400">
                  9.00 AM – 9.00 PM
                </div>
                <div className="text-gray-300">Daily Timings</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-400">500+</div>
                <div className="text-gray-300">Exhibitors</div>
              </div>
            </div>
            <div className="text-center mt-6">
              <p className="text-lg text-blue-200">
                BMICH, Bauddhaloka Mawatha, Colombo 07
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Sri Lanka Book Publishers&apos; Association
              </h3>
              <div className="text-gray-400 space-y-1 text-sm">
                <p>No: 83, New Parliament Rd,</p>
                <p>Battaramulla, Sri Lanka</p>
                <p>Phone: +94 11 2785480</p>
                <p>Email: srilankabookpublishers@gmail.com</p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="text-gray-400 space-y-2 text-sm">
                <p>
                  <a href="#home" className="hover:text-white">
                    Home
                  </a>
                </p>
                <p>
                  <a href="#about" className="hover:text-white">
                    About
                  </a>
                </p>
                <p>
                  <a href="#events" className="hover:text-white">
                    Events
                  </a>
                </p>
                <p>
                  <a href="#gallery" className="hover:text-white">
                    Photo Gallery
                  </a>
                </p>
                <p>
                  <a href="#contact" className="hover:text-white">
                    Contact
                  </a>
                </p>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
              <div className="text-gray-400 space-y-2 text-sm">
                <p>
                  <a
                    href="https://www.facebook.com/ColomboInternationalBookFair"
                    className="hover:text-white"
                  >
                    Facebook
                  </a>
                </p>
                <p>
                  <a href="#" className="hover:text-white">
                    Instagram
                  </a>
                </p>
              </div>
              <div className="mt-6">
                <p className="text-xs text-gray-500">
                  Copyright ©2025 All rights reserved | Sri Lanka Book Publishers&apos;
                  Association
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

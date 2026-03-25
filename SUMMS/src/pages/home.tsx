import React from 'react';
import { useNavigate } from 'react-router-dom'

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">SUMMS</h1>
          <ul className="flex gap-6">
            <li><a href="#features" className="text-gray-600 hover:text-blue-600">Features</a></li>
            <li><a href="#about" className="text-gray-600 hover:text-blue-600">About</a></li>
            <li><a href="#contact" className="text-gray-600 hover:text-blue-600">Contact</a></li>
          </ul>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-4">Welcome to SUMMS</h2>
        <p className="text-xl text-gray-600 mb-8">Streamline, Unify, Manage, Monitor, and Succeed</p>
        <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition">
          Get Started
        </button>
      </section>

      {/* ── External Services Navigation ──
           Added to satisfy Sprint 1 requirement: functional navigation
           to Parking and Public Transport from the main app page.       */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-gray-900 mb-4 text-center">Other Services</h3>
        <p className="text-center text-gray-500 mb-10">
          Access additional mobility services available on the platform.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">

          {/* Navigate to Parking Reservation System */}
          <button
            onClick={() => navigate('/parking')}
            className="flex items-center gap-4 bg-white p-6 rounded-lg shadow hover:shadow-lg hover:-translate-y-0.5 transition-all text-left"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                <path d="M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Parking Reservations</p>
              <p className="text-sm text-gray-500">Locate, reserve and pay for parking</p>
            </div>
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-300 ml-auto shrink-0" fill="currentColor">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </button>

          {/* Navigate to Public Transport Schedule Viewer */}
          <button
            onClick={() => navigate('/transport')}
            className="flex items-center gap-4 bg-white p-6 rounded-lg shadow hover:shadow-lg hover:-translate-y-0.5 transition-all text-left"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-gray-900">Public Transport</p>
              <p className="text-sm text-gray-500">Bus, tram, metro and train schedules</p>
            </div>
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-300 ml-auto shrink-0" fill="currentColor">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </button>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2026 SUMMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

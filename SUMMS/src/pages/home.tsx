import React from 'react';
import { useNavigate } from 'react-router-dom';
import imgLogo from "../assets/logo.png";
import imgAdminLogo from "../assets/adminLogo.png";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#f3f3f3]">

   
      <nav className="bg-[#76c573] shadow-[0px_4px_25px_rgba(0,0,0,0.18)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white tracking-wide">SUMMS</h1>
          <div className="flex items-center gap-6">
            <ul className="flex gap-6">
              <li><a href="#features" className="text-white/80 hover:text-white transition text-sm font-medium">Features</a></li>
              <li><a href="#about"    className="text-white/80 hover:text-white transition text-sm font-medium">About</a></li>
            </ul>
           
            <div className="flex items-center gap-3">
              <img src={imgAdminLogo} alt="Admin" className="h-9 w-9 object-contain" />
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#165713] text-white">
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Zm0 2c-3.866 0-7 3.134-7 7 0 .552.448 1 1 1h12c.552 0 1-.448 1-1 0-3.866-3.134-7-7-7Z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </nav>

     
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center overflow-hidden">
        {/* watermark */}
        <img
          src={imgLogo}
          alt=""
          className="pointer-events-none absolute left-1/2 top-1/2 w-[700px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 opacity-20"
        />
        <div className="relative z-10">
          <h2 className="text-5xl font-bold text-[#297525] mb-4">Welcome to SUMMS :kk</h2>
          <p className="text-xl text-gray-500 mb-8">Streamline, Unify, Manage, Monitor, and Succeed</p>
          <button
      onClick={() => navigate('/vehicle-search')}
      className="bg-[#1fae19] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#165713] transition shadow"
    >
      Get Started
    </button>
        </div>
      </section>

      {/* features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-[#297525] mb-12 text-center">Key Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Easy Management',      desc: 'Manage all your systems in one centralized dashboard.' },
            { title: 'Real-time Monitoring', desc: 'Monitor your systems with real-time updates and alerts.' },
            { title: 'Secure & Reliable',    desc: 'Enterprise-grade security for your peace of mind.' },
          ].map((f) => (
            <div
              key={f.title}
              className="
                rounded-[24px] border-2 border-white/80 p-6
                bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(245,245,245,0.96)_75.2%,rgba(255,255,255,0.41)_98.8%)]
                shadow-[0px_4px_20px_rgba(0,0,0,0.08)] backdrop-blur-[6px]
                hover:shadow-[0px_6px_28px_rgba(0,0,0,0.13)] hover:-translate-y-0.5 transition-all
              "
            >
              <h4 className="text-xl font-semibold text-[#297525] mb-2">{f.title}</h4>
              <p className="text-gray-500 text-sm">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

  
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h3 className="text-3xl font-bold text-[#297525] mb-4 text-center">Other Services</h3>
        <p className="text-center text-gray-500 mb-10">
          Access additional mobility services available on the platform.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">

         
          <button
            onClick={() => navigate('/parking')}
            className="
              flex items-center gap-4 p-6 text-left
              rounded-[24px] border-2 border-white/80
              bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(245,245,245,0.96)_75.2%,rgba(255,255,255,0.41)_98.8%)]
              shadow-[0px_4px_20px_rgba(0,0,0,0.08)] backdrop-blur-[6px]
              hover:shadow-[0px_6px_28px_rgba(0,0,0,0.13)] hover:-translate-y-0.5 transition-all
            "
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#76c573] text-white">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                <path d="M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-[#297525]">Parking Reservations</p>
              <p className="text-sm text-gray-500">Locate, reserve and pay for parking</p>
            </div>
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-300 ml-auto shrink-0" fill="currentColor">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </button>

          <button
            onClick={() => navigate('/transport')}
            className="
              flex items-center gap-4 p-6 text-left
              rounded-[24px] border-2 border-white/80
              bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(245,245,245,0.96)_75.2%,rgba(255,255,255,0.41)_98.8%)]
              shadow-[0px_4px_20px_rgba(0,0,0,0.08)] backdrop-blur-[6px]
              hover:shadow-[0px_6px_28px_rgba(0,0,0,0.13)] hover:-translate-y-0.5 transition-all
            "
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#76c573] text-white">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-[#297525]">Public Transport</p>
              <p className="text-sm text-gray-500">Bus, tram, metro and train schedules</p>
            </div>
            <svg viewBox="0 0 24 24" className="h-5 w-5 text-gray-300 ml-auto shrink-0" fill="currentColor">
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </button>

        </div>
      </section>

      
      <footer className="bg-[#165713] text-white mt-20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-white/70">&copy; 2026 SUMMS. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default Home;

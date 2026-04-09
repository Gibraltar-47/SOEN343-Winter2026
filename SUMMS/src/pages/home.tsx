import React from "react";
import { useNavigate } from "react-router-dom";
import imgLogo from "../assets/logo.png";
import AppHeader from "../component/AppHeader";

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#f3f3f3]">
      <AppHeader />

      <section className="relative mx-auto max-w-7xl overflow-hidden px-4 py-24 text-center sm:px-6 lg:px-8">
        <img
          src={imgLogo}
          alt=""
          className="pointer-events-none absolute left-1/2 top-1/2 w-[700px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 opacity-20"
        />

        <div className="relative z-10">
          <h2 className="mb-4 text-5xl font-bold text-[#297525]">
            Welcome to SUMMS
          </h2>
          <p className="mb-8 text-xl text-gray-500">
            Streamline, Unify, Manage, Monitor, and Succeed
          </p>

          <button
            onClick={() => navigate("/vehicle-search")}
            className="rounded-full bg-[#1fae19] px-8 py-3 font-semibold text-white shadow transition hover:bg-[#165713]"
          >
            Get Started
          </button>
        </div>
      </section>

      <section
        id="features"
        className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8"
      >
        <h3 className="mb-12 text-center text-3xl font-bold text-[#297525]">
          Key Features
        </h3>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {[
            {
              title: "Easy Management",
              desc: "Manage all your systems in one centralized dashboard.",
            },
            {
              title: "Real-time Monitoring",
              desc: "Monitor your systems with real-time updates and alerts.",
            },
            {
              title: "Secure & Reliable",
              desc: "Enterprise-grade security for your peace of mind.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="
                rounded-[24px] border-2 border-white/80 p-6
                bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(245,245,245,0.96)_75.2%,rgba(255,255,255,0.41)_98.8%)]
                shadow-[0px_4px_20px_rgba(0,0,0,0.08)] backdrop-blur-[6px]
                transition-all hover:-translate-y-0.5 hover:shadow-[0px_6px_28px_rgba(0,0,0,0.13)]
              "
            >
              <h4 className="mb-2 text-xl font-semibold text-[#297525]">
                {f.title}
              </h4>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h3 className="mb-4 text-center text-3xl font-bold text-[#297525]">
          Other Services
        </h3>
        <p className="mb-10 text-center text-gray-500">
          Access additional mobility services available on the platform.
        </p>

        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-6 md:grid-cols-2">
          <button
            onClick={() => navigate("/parking")}
            className="
              flex items-center gap-4 p-6 text-left
              rounded-[24px] border-2 border-white/80
              bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(245,245,245,0.96)_75.2%,rgba(255,255,255,0.41)_98.8%)]
              shadow-[0px_4px_20px_rgba(0,0,0,0.08)] backdrop-blur-[6px]
              transition-all hover:-translate-y-0.5 hover:shadow-[0px_6px_28px_rgba(0,0,0,0.13)]
            "
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#76c573] text-white">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                <path d="M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z" />
              </svg>
            </div>

            <div>
              <p className="font-semibold text-[#297525]">
                Parking Reservations
              </p>
              <p className="text-sm text-gray-500">
                Locate, reserve and pay for parking
              </p>
            </div>

            <svg
              viewBox="0 0 24 24"
              className="ml-auto h-5 w-5 shrink-0 text-gray-300"
              fill="currentColor"
            >
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </button>

          <button
            onClick={() => navigate("/transport")}
            className="
              flex items-center gap-4 p-6 text-left
              rounded-[24px] border-2 border-white/80
              bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(245,245,245,0.96)_75.2%,rgba(255,255,255,0.41)_98.8%)]
              shadow-[0px_4px_20px_rgba(0,0,0,0.08)] backdrop-blur-[6px]
              transition-all hover:-translate-y-0.5 hover:shadow-[0px_6px_28px_rgba(0,0,0,0.13)]
            "
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#76c573] text-white">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
              </svg>
            </div>

            <div>
              <p className="font-semibold text-[#297525]">Public Transport</p>
              <p className="text-sm text-gray-500">
                Bus, tram, metro and train schedules
              </p>
            </div>

            <svg
              viewBox="0 0 24 24"
              className="ml-auto h-5 w-5 shrink-0 text-gray-300"
              fill="currentColor"
            >
              <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
            </svg>
          </button>
        </div>
      </section>

      <footer className="mt-20 bg-[#165713] py-8 text-white">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-white/70">
            &copy; 2026 SUMMS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
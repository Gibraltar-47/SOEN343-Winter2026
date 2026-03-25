import { useNavigate } from "react-router-dom";
import imgLogo from "../assets/logo.png";
import imgAdminLogo from "../assets/adminLogo.png";

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
        <path d="M12 2c-4.42 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm5.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-7h-5V6h5v4z" />
      </svg>
    ),
    label: "Bus",
    desc: "City-wide bus routes with live arrival times.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
        <path d="M19 15.18V7c0-2.21-1.79-4-4-4h-1V1h-4v2H9C6.79 3 5 4.79 5 7v8.18C3.84 15.6 3 16.71 3 18v3h2v1h2v-1h10v1h2v-1h2v-3c0-1.29-.84-2.4-2-2.82zM16 13H8V7h8v6zm-6.5 3c.83 0 1.5.67 1.5 1.5S10.33 19 9.5 19 8 18.33 8 17.5 8.67 16 9.5 16zm5 0c.83 0 1.5.67 1.5 1.5S15.33 19 14.5 19 13 18.33 13 17.5s.67-1.5 1.5-1.5z" />
      </svg>
    ),
    label: "Tram",
    desc: "Tram schedules with real-time delay alerts.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
        <path d="M4 15.5C4 17.43 5.57 19 7.5 19L6 20.5V22h12v-1.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V5c0-3.5-3.58-4-8-4S4 1.5 4 5v10.5zm8 1.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm6-7H6V5h12v5z" />
      </svg>
    ),
    label: "Metro",
    desc: "Underground metro lines, platforms and capacity.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
        <path d="M4 15.5C4 17.43 5.57 19 7.5 19L6 20.5V22h12v-1.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V8c0-2.21-1.79-4-4-4h-1V2H9v2H8C5.79 4 4 5.79 4 8v7.5zm4.5 1c-.83 0-1.5-.67-1.5-1.5S7.67 13.5 8.5 13.5s1.5.67 1.5 1.5S9.33 16.5 8.5 16.5zm7 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM19 11H5V8h14v3z" />
      </svg>
    ),
    label: "Train",
    desc: "Regional and commuter rail departure boards.",
  },
];

export default function PublicTransport() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-[#f3f3f3] overflow-hidden">
      <div className="flex min-h-screen flex-col">

   
        <header className="flex h-[72px] items-center justify-between bg-[#76c573] px-4 shadow-[0px_4px_25px_rgba(0,0,0,0.18)] sm:px-6">
          <button
            onClick={() => navigate("/home")}
            className="flex items-center gap-2 text-white hover:text-[#165713] transition"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            <span className="text-sm font-semibold">Back</span>
          </button>

          <div className="flex items-center gap-3">
            <img src={imgAdminLogo} alt="Admin" className="h-9 w-9 object-contain sm:h-10 sm:w-10" />
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#165713] text-white sm:h-10 sm:w-10">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Zm0 2c-3.866 0-7 3.134-7 7 0 .552.448 1 1 1h12c.552 0 1-.448 1-1 0-3.866-3.134-7-7-7Z" />
              </svg>
            </div>
          </div>
        </header>

        <main className="relative flex flex-1 flex-col items-center px-4 py-12 sm:px-6 lg:px-8">
          <img
            src={imgLogo}
            alt=""
            className="pointer-events-none absolute left-1/2 top-1/2 w-[700px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 opacity-30 sm:w-[820px] lg:w-[950px]"
          />

          <div className="relative z-10 w-full max-w-2xl flex flex-col items-center gap-8">

            
            <div className="flex flex-col items-center gap-3">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#76c573] text-white shadow-lg">
                <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
                </svg>
              </div>
              <h1 className="text-center text-[32px] font-medium text-[#297525]">
                Public Transport
              </h1>
              <p className="text-center text-gray-500 text-sm max-w-sm">
                Bus, REM, metro and train schedules all in one place.
              </p>
            </div>

           
            <div className="rounded-full bg-[#165713] px-6 py-2 text-sm font-semibold text-white tracking-wide shadow">
               Coming Soon
            </div>

            
            <div className="grid grid-cols-2 gap-3 w-full">
              {FEATURES.map((f) => (
                <div
                  key={f.label}
                  className="
                    flex items-center gap-2 rounded-full px-5 py-3
                    border-2 border-white/80
                    bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(245,245,245,0.96)_75.2%)]
                    shadow-[0px_4px_16px_rgba(0,0,0,0.08)] backdrop-blur-[6px]
                  "
                >
                  <span className="text-[#76c573]">{f.icon}</span>
                  <div>
                    <p className="font-semibold text-[#297525] text-sm leading-tight">{f.label}</p>
                    <p className="text-xs text-gray-400">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

           
          </div>
        </main>
      </div>
    </div>
  );
}
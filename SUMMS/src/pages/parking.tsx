import { useNavigate } from "react-router-dom";
import imgLogo from "../assets/logo.png";
import imgAdminLogo from "../assets/adminLogo.png";

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
      </svg>
    ),
    title: "Real-Time Availability",
    desc: "See open spots near you updated live across the city.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 3c1.93 0 3.5 1.57 3.5 3.5S13.93 13 12 13s-3.5-1.57-3.5-3.5S10.07 6 12 6zm7 13H5v-.23c0-.62.28-1.2.76-1.58C7.47 15.82 9.64 15 12 15s4.53.82 6.24 2.19c.48.38.76.97.76 1.58V19z" />
      </svg>
    ),
    title: "Reserve in Advance",
    desc: "Book your spot ahead of time",
  },
];

export default function Parking() {
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
                  <path d="M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z" />
                </svg>
              </div>
              <h1 className="text-center text-[32px] font-medium text-[#297525]">
                Parking Reservations
              </h1>
              <p className="text-center text-gray-500 text-sm max-w-sm">
                Find, reserve  and pay for parking across Montreal and Laval
              </p>
            </div>

           
            <div className="rounded-full bg-[#165713] px-6 py-2 text-sm font-semibold text-white tracking-wide shadow">
             Coming Soon
            </div>

          
            <div className="grid grid-cols-1 gap-4 w-full sm:grid-cols-2">
              {FEATURES.map((f) => (
                <div
                  key={f.title}
                  className="
                    rounded-[24px] border-2 border-white/80 p-5
                    bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(245,245,245,0.96)_75.2%,rgba(255,255,255,0.41)_98.8%)]
                    shadow-[0px_4px_20px_rgba(0,0,0,0.08)] backdrop-blur-[6px]
                    flex gap-4 items-start
                  "
                >
                  <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#76c573] text-white">
                    {f.icon}
                  </div>
                  <div>
                    <p className="font-semibold text-[#297525]">{f.title}</p>
                    <p className="mt-1 text-sm text-gray-500">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>

           
            <div
              className="
                w-full rounded-[28px] border-2 border-white/80 p-6 text-center
                bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(245,245,245,0.96)_75.2%)]
                shadow-[0px_4px_30px_rgba(0,0,0,0.10)] backdrop-blur-[6px]
              "
            >
              <p className="text-[#297525] font-medium text-lg mb-1">Want early access?</p>
              <p className="text-gray-500 text-sm mb-4">This feature is under development. Check back soon.</p>
              <button
                disabled
                className="h-12 rounded-full bg-[#76c573] px-8 text-sm font-semibold text-white opacity-60 cursor-not-allowed"
              >
                Notify Me When Available
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}

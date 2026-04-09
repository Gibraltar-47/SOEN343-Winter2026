import { useNavigate } from "react-router-dom";
import imgLogo from "../assets/logo.png";
import AppHeader from "../component/AppHeader";

export default function ProviderDashboard() {
  const navigate = useNavigate();
  const providerName = localStorage.getItem("providerName") || "Mobility Provider";

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#f3f3f3]">
      <div className="flex min-h-screen flex-col">
        <AppHeader />

        <main className="relative flex flex-1 flex-col items-center px-4 py-12 sm:px-6 lg:px-8">
          <img
            src={imgLogo}
            alt=""
            className="pointer-events-none absolute left-1/2 top-1/2 w-[700px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 opacity-30 sm:w-[820px] lg:w-[950px]"
          />

          <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
            <div className="w-full rounded-[32px] border-2 border-white/80 bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(234,234,234,0.49)_42.6%,rgba(245,245,245,0.96)_75.2%,rgba(255,255,255,0.41)_98.8%)] px-6 py-8 shadow-[0px_4px_28px_rgba(0,0,0,0.10)] backdrop-blur-[6px] sm:px-8">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#76c573] text-white shadow-lg">
                  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
                    <path d="M12 2c-4.42 0-8 .5-8 4v9.5C4 17.43 5.57 19 7.5 19L6 20.5v.5h12v-.5L16.5 19c1.93 0 3.5-1.57 3.5-3.5V6c0-3.5-3.58-4-8-4zM7.5 17c-.83 0-1.5-.67-1.5-1.5S6.67 14 7.5 14s1.5.67 1.5 1.5S8.33 17 7.5 17zm3.5-7H6V6h5v4zm5.5 7c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm1.5-7h-5V6h5v4z" />
                  </svg>
                </div>

                <h1 className="text-center text-[32px] font-medium text-[#297525]">
                  Provider Dashboard
                </h1>

                <p className="text-center text-sm text-gray-500">{providerName}</p>
              </div>

              <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  onClick={() => navigate("/provider/add-vehicle")}
                  className="rounded-full border-2 border-white/80 bg-white/70 px-6 py-4 text-left shadow-[0px_4px_16px_rgba(0,0,0,0.08)] transition hover:scale-[1.01]"
                >
                  <p className="text-base font-semibold text-[#297525]">Add Vehicle</p>
                  <p className="text-sm text-gray-400">
                    Register a new vehicle in the provider fleet.
                  </p>
                </button>

                <button
                  onClick={() => navigate("/provider/vehicles")}
                  className="rounded-full border-2 border-white/80 bg-white/70 px-6 py-4 text-left shadow-[0px_4px_16px_rgba(0,0,0,0.08)] transition hover:scale-[1.01]"
                >
                  <p className="text-base font-semibold text-[#297525]">Manage Vehicles</p>
                  <p className="text-sm text-gray-400">
                    Edit or remove vehicles from the current fleet.
                  </p>
                </button>
                <button
                  onClick={() => navigate("/provider/rentals")}
                  className="rounded-full border-2 border-white/80 bg-white/70 px-6 py-4 text-left shadow-[0px_4px_16px_rgba(0,0,0,0.08)] transition hover:scale-[1.01]"
                >
                  <p className="text-base font-semibold text-[#297525]">Manage Rentals</p>
                  <p className="text-sm text-gray-400">
                    View reservations and manage their current status.
                  </p>
                </button>
                <button
                  onClick={() => navigate("/provider/profit")}
                  className="rounded-full border-2 border-white/80 bg-white/70 px-6 py-4 text-left shadow-[0px_4px_16px_rgba(0,0,0,0.08)] transition hover:scale-[1.01]"
                >
                  <p className="text-base font-semibold text-[#297525]">View Profit</p>
                  <p className="text-sm text-gray-400">
                    See total revenue earned from your rentals.
                  </p>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
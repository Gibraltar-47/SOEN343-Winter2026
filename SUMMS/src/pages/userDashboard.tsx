import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import imgLogo from "../assets/logo.png";
import { sessionService } from "../services/sessionService";
import AppHeader from '../component/AppHeader';

type UserPreferences = {
  preferredCity: string;
  preferredMode: string;
};

const PREFERENCES_KEY = "userPreferences";

function getStoredPreferences(): Record<string, UserPreferences> {
  return JSON.parse(localStorage.getItem(PREFERENCES_KEY) || "{}");
}

function saveStoredPreferences(preferences: Record<string, UserPreferences>) {
  localStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
}

export default function UserDashboard() {
  const navigate = useNavigate();
  const currentUser = sessionService.getCurrentUser();

  const [preferredCity, setPreferredCity] = useState("");
  const [preferredMode, setPreferredMode] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!currentUser?.id) return;

    const preferences = getStoredPreferences();
    const userPreferences = preferences[currentUser.id];

    if (userPreferences) {
      setPreferredCity(userPreferences.preferredCity);
      setPreferredMode(userPreferences.preferredMode);
    }
  }, [currentUser]);

  function handleSavePreferences() {
    if (!currentUser?.id) return;

    const preferences = getStoredPreferences();

    preferences[currentUser.id] = {
      preferredCity,
      preferredMode,
    };

    saveStoredPreferences(preferences);
    setMessage("Preferences saved successfully.");
  }

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

          <div className="relative z-10 flex w-full max-w-3xl flex-col items-center">
            <div className="w-full rounded-[32px] border-2 border-white/80 bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(234,234,234,0.49)_42.6%,rgba(245,245,245,0.96)_75.2%,rgba(255,255,255,0.41)_98.8%)] px-6 py-8 shadow-[0px_4px_28px_rgba(0,0,0,0.10)] backdrop-blur-[6px] sm:px-8">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#76c573] text-white shadow-lg">
                  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
                    <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Zm0 2c-3.866 0-7 3.134-7 7 0 .552.448 1 1 1h12c.552 0 1-.448 1-1 0-3.866-3.134-7-7-7Z" />
                  </svg>
                </div>

                <h1 className="text-center text-[32px] font-medium text-[#297525]">
                  User Dashboard
                </h1>

                <p className="text-center text-sm text-gray-500">
                  {currentUser
                    ? `${currentUser.firstName} ${currentUser.lastName}`
                    : "Customer"}
                </p>
              </div>

              {message ? (
                <div className="mt-6 w-full rounded-full bg-white/80 px-5 py-3 text-center text-sm text-[#297525] shadow-[0px_4px_16px_rgba(0,0,0,0.08)]">
                  {message}
                </div>
              ) : null}

              <div className="mt-8 rounded-[28px] border-2 border-white/80 bg-white/70 p-6 shadow-[0px_4px_16px_rgba(0,0,0,0.08)]">
                <h2 className="text-xl font-semibold text-[#297525]">
                  My Preferences
                </h2>

                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <select
                    value={preferredCity}
                    onChange={(e) => setPreferredCity(e.target.value)}
                    className="h-11 w-full rounded-full border-2 border-white/80 bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(245,245,245,0.96)_75.2%)] px-5 text-sm text-gray-700 shadow-[0px_4px_16px_rgba(0,0,0,0.08)] outline-none focus:border-[#76c573]"
                  >
                    <option value="">Preferred city</option>
                    <option value="Montreal">Montreal</option>
                    <option value="Laval">Laval</option>
                    <option value="Longueuil">Longueuil</option>
                    <option value="Quebec City">Quebec City</option>
                  </select>

                  <select
                    value={preferredMode}
                    onChange={(e) => setPreferredMode(e.target.value)}
                    className="h-11 w-full rounded-full border-2 border-white/80 bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(245,245,245,0.96)_75.2%)] px-5 text-sm text-gray-700 shadow-[0px_4px_16px_rgba(0,0,0,0.08)] outline-none focus:border-[#76c573]"
                  >
                    <option value="">Preferred mode of transport</option>
                    <option value="Car">Car</option>
                    <option value="Bike">Bike</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Van">Van</option>
                  </select>
                </div>

                <button
                  onClick={handleSavePreferences}
                  className="mt-5 rounded-full bg-[#165713] px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#11440f]"
                >
                  Save Preferences
                </button>
              </div>

              <div className="mt-8 grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  onClick={() => navigate("/my-rentals")}
                  className="rounded-full border-2 border-white/80 bg-white/70 px-6 py-4 text-left shadow-[0px_4px_16px_rgba(0,0,0,0.08)] transition hover:scale-[1.01]"
                >
                  <p className="text-base font-semibold text-[#297525]">
                    Manage My Rentals
                  </p>
                  <p className="text-sm text-gray-400">
                    Start, complete, or cancel your reservations.
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
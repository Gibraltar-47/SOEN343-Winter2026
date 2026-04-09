import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sessionService } from "../services/sessionService";

export default function AppHeader() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const currentUser = sessionService.getCurrentUser();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  function handleLogoClick() {
    if (currentUser) {
      navigate(sessionService.getDashboardRoute());
      return;
    }
    navigate("/");
  }

  function handleDashboardClick() {
    navigate(sessionService.getProfileRoute());
  }

  function handleLogout() {
    sessionService.logout();
    navigate("/");
  }

  return (
    <nav className="bg-[#76c573] shadow-[0px_4px_25px_rgba(0,0,0,0.18)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between relative">
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15 text-white hover:bg-white/25 transition"
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor">
              <path d="M4 6h16v2H4V6Zm0 5h16v2H4v-2Zm0 5h16v2H4v-2Z" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute left-0 mt-3 w-56 rounded-xl bg-white shadow-xl border border-gray-200 overflow-hidden z-50">
              <button
                onClick={() => {
                  navigate("/vehicle-search");
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
              >
                Vehicle Search
              </button>

              <button
                onClick={() => {
                  navigate("/transport");
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
              >
                Public Transport
              </button>

              <button
                onClick={() => {
                  navigate("/parking");
                  setMenuOpen(false);
                }}
                className="w-full text-left px-4 py-3 hover:bg-gray-100 text-sm"
              >
                Parking
              </button>

              <div className="border-t border-gray-200" />

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 hover:bg-red-50 text-sm text-red-600 font-medium"
              >
                Logout
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleLogoClick}
          className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold text-white tracking-wide"
        >
          SUMMS
        </button>

        <button
          onClick={handleDashboardClick}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-[#165713] text-white hover:bg-[#12450f] transition"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
            <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Zm0 2c-3.866 0-7 3.134-7 7 0 .552.448 1 1 1h12c.552 0 1-.448 1-1 0-3.866-3.134-7-7-7Z" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import imgLogo from "../assets/logo.png";
import AppHeader from "../component/AppHeader";
import { sessionService } from "../services/sessionService";

type RentalStatus = "reserved" | "active" | "completed" | "cancelled";

type ProviderRental = {
  id: string;
  userId: string;
  userName: string;
  providerId: string;
  providerName: string;
  vehicleId: string;
  vehicleName: string;
  city: string;
  region: string;
  pricePerHour: number;
  type: string;
  paymentMethod: string;
  total: number;
  status: RentalStatus;
  reservedAt: string;
  startedAt?: string;
  endedAt?: string;
};

const RENTALS_KEY = "rentals";

function getStoredRentals(): ProviderRental[] {
  return JSON.parse(localStorage.getItem(RENTALS_KEY) || "[]");
}

function saveStoredRentals(rentals: ProviderRental[]) {
  localStorage.setItem(RENTALS_KEY, JSON.stringify(rentals));
}

function getStatusClasses(status: string) {
  switch (status) {
    case "reserved":
      return "bg-[#fff7d6] text-[#8a6d1f]";
    case "active":
      return "bg-[#d9f6ff] text-[#176b87]";
    case "completed":
      return "bg-[#dff5df] text-[#297525]";
    case "cancelled":
      return "bg-[#ffe0e6] text-[#b4233c]";
    default:
      return "bg-gray-100 text-gray-500";
  }
}

function formatDate(value?: string) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleString();
}

export default function ManageRentals() {
  const navigate = useNavigate();
  const currentUser = sessionService.getCurrentUser();
  const providerId = currentUser?.id;

  const [rentals, setRentals] = useState<ProviderRental[]>([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const allRentals = getStoredRentals();

    if (!providerId) {
      setRentals([]);
      return;
    }

    setRentals(
      allRentals.filter(
        (rental) => String(rental.providerId).trim() === String(providerId).trim(),
      ),
    );
  }, [providerId]);

  const sortedRentals = useMemo(() => {
    return [...rentals].sort(
      (a, b) =>
        new Date(b.reservedAt).getTime() - new Date(a.reservedAt).getTime(),
    );
  }, [rentals]);

  function refreshRentals() {
    const allRentals = getStoredRentals();

    setRentals(
      allRentals.filter(
        (rental) => String(rental.providerId).trim() === String(providerId).trim(),
      ),
    );
  }

  function handleCancelRental(rentalId: string) {
    const allRentals = getStoredRentals();

    const updatedRentals = allRentals.map((rental) => {
      if (rental.id !== rentalId) {
        return rental;
      }

      if (rental.status === "completed" || rental.status === "cancelled") {
        return rental;
      }

      return {
        ...rental,
        status: "cancelled" as RentalStatus,
        endedAt: rental.status === "active" ? new Date().toISOString() : rental.endedAt,
      };
    });

    saveStoredRentals(updatedRentals);
    refreshRentals();
    setMessage("Rental cancelled successfully.");
  }

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#f3f3f3]">
      <AppHeader />
      
            <div className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6">
              <button
                onClick={() => navigate("/provider")}
                className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#165713] transition hover:text-[#0f3f0d]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                  <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                </svg>
                Back
              </button>

        <main className="relative flex flex-1 flex-col items-center px-4 py-12 sm:px-6 lg:px-8">
          <img
            src={imgLogo}
            alt=""
            className="pointer-events-none absolute left-1/2 top-1/2 w-[700px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 opacity-30 sm:w-[820px] lg:w-[950px]"
          />

          <div className="relative z-10 flex w-full max-w-5xl flex-col items-center">
            <div className="w-full rounded-[32px] border-2 border-white/80 bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(234,234,234,0.49)_42.6%,rgba(245,245,245,0.96)_75.2%,rgba(255,255,255,0.41)_98.8%)] px-6 py-8 shadow-[0px_4px_28px_rgba(0,0,0,0.10)] backdrop-blur-[6px] sm:px-8">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#76c573] text-white shadow-lg">
                  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
                    <path d="M6 6h15v10H6zM3 8h2v6H3zm4 10h10v2H7z" />
                  </svg>
                </div>

                <h1 className="text-center text-[32px] font-medium text-[#297525]">
                  Manage Rentals
                </h1>

                <p className="text-center text-sm text-gray-500">
                  View reservations for your vehicles and manage their status.
                </p>
              </div>

              {message ? (
                <div className="mt-6 w-full rounded-full bg-white/80 px-5 py-3 text-center text-sm text-[#297525] shadow-[0px_4px_16px_rgba(0,0,0,0.08)]">
                  {message}
                </div>
              ) : null}

              <div className="mt-8">
                {sortedRentals.length === 0 ? (
                  <div className="mx-auto w-fit rounded-full bg-[#165713] px-6 py-2 text-sm font-semibold tracking-wide text-white shadow">
                    No rentals found
                  </div>
                ) : (
                  <div className="grid w-full grid-cols-1 gap-4">
                    {sortedRentals.map((rental) => (
                      <div
                        key={rental.id}
                        className="rounded-[28px] border-2 border-white/80 bg-white/70 px-6 py-5 shadow-[0px_4px_16px_rgba(0,0,0,0.08)]"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                              <p className="text-lg font-semibold text-[#297525]">
                                {rental.vehicleName}
                              </p>
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getStatusClasses(
                                  rental.status,
                                )}`}
                              >
                                {rental.status}
                              </span>
                            </div>

                            <p className="text-sm text-gray-500">
                              Reserved by{" "}
                              <span className="font-semibold text-[#297525]">
                                {rental.userName}
                              </span>
                            </p>

                            <p className="text-sm text-gray-500">
                              {rental.type} · {rental.city}, {rental.region}
                            </p>

                            <p className="text-sm text-gray-500">
                              Payment: {rental.paymentMethod} · Total: $
                              {Number(rental.total).toFixed(2)}
                            </p>

                            <p className="text-sm text-gray-400">
                              Reserved on {formatDate(rental.reservedAt)}
                            </p>

                            <p className="text-sm text-gray-400">
                              Started at {formatDate(rental.startedAt)}
                            </p>

                            <p className="text-sm text-gray-400">
                              Ended at {formatDate(rental.endedAt)}
                            </p>
                          </div>

                          <div className="flex flex-col gap-2 lg:items-end">
                            <div className="rounded-full bg-[#f3f3f3] px-4 py-2 text-sm text-gray-500">
                              ${rental.pricePerHour}/h
                            </div>

                            {rental.status === "reserved" || rental.status === "active" ? (
                              <button
                                onClick={() => handleCancelRental(rental.id)}
                                className="rounded-full bg-[#d4183d] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                              >
                                Cancel Rental
                              </button>
                            ) : (
                              <div className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-gray-400">
                                {rental.status === "cancelled"
                                  ? "Already cancelled"
                                  : "No action available"}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
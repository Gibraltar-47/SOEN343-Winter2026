import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import imgLogo from "../assets/logo.png";
import imgAdminLogo from "../assets/adminLogo.png";
import { sessionService } from "../services/sessionService";

type RentalStatus = "reserved" | "active" | "completed" | "cancelled";

type UserRental = {
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

function getStoredRentals(): UserRental[] {
  return JSON.parse(localStorage.getItem(RENTALS_KEY) || "[]");
}

function saveStoredRentals(rentals: UserRental[]) {
  localStorage.setItem(RENTALS_KEY, JSON.stringify(rentals));
}

function getStatusClasses(status: RentalStatus) {
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
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString();
}

function calculateCompletedTotal(
  pricePerHour: number,
  startedAt?: string,
  endedAt?: string,
) {
  if (!startedAt || !endedAt) return 0;

  const start = new Date(startedAt).getTime();
  const end = new Date(endedAt).getTime();

  if (Number.isNaN(start) || Number.isNaN(end) || end <= start) {
    return 0;
  }

  const hours = (end - start) / (1000 * 60 * 60);
  return Number((hours * pricePerHour).toFixed(2));
}

export default function ManageMyRentals() {
  const navigate = useNavigate();
  const currentUser = sessionService.getCurrentUser();
  const userId = currentUser?.id;

  const [rentals, setRentals] = useState<UserRental[]>([]);
  const [message, setMessage] = useState("");

  function refreshRentals() {
    const allRentals = getStoredRentals();

    if (!currentUser) {
        setRentals([]);
        return;
    }

    const currentUserId = String(currentUser.id).trim();

    const userRentals = allRentals.filter((rental) => {
        return String(rental.userId).trim() === currentUserId;
    });

    setRentals(userRentals);
    }
  useEffect(() => {
    refreshRentals();
  }, [userId]);

  const sortedRentals = useMemo(() => {
    return [...rentals].sort(
      (a, b) =>
        new Date(b.reservedAt).getTime() - new Date(a.reservedAt).getTime(),
    );
  }, [rentals]);

  function handleStartRental(rentalId: string) {
    const allRentals = getStoredRentals();

    const updatedRentals = allRentals.map((rental) => {
      if (rental.id !== rentalId) return rental;
      if (rental.status !== "reserved") return rental;

      return {
        ...rental,
        status: "active" as RentalStatus,
        startedAt: new Date().toISOString(),
      };
    });

    saveStoredRentals(updatedRentals);
    refreshRentals();
    setMessage("Rental started successfully.");
  }

  function handleCompleteRental(rentalId: string) {
    const allRentals = getStoredRentals();

    const updatedRentals = allRentals.map((rental) => {
      if (rental.id !== rentalId) return rental;
      if (rental.status !== "active") return rental;

      const endedAt = new Date().toISOString();
      const total = calculateCompletedTotal(
        rental.pricePerHour,
        rental.startedAt,
        endedAt,
      );

      return {
        ...rental,
        status: "completed" as RentalStatus,
        endedAt,
        total,
      };
    });

    saveStoredRentals(updatedRentals);
    refreshRentals();
    setMessage("Rental completed successfully.");
  }

  function handleCancelRental(rentalId: string) {
    const allRentals = getStoredRentals();

    const updatedRentals = allRentals.map((rental) => {
      if (rental.id !== rentalId) return rental;
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
      <div className="flex flex-col">
        <header className="flex h-[72px] items-center justify-between bg-[#76c573] px-4 shadow-[0px_4px_25px_rgba(0,0,0,0.18)] sm:px-6">
          <button
            onClick={() => navigate("/user")}
            className="flex items-center gap-2 text-white transition hover:text-[#165713]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            <span className="text-sm font-semibold">Back</span>
          </button>

          <div className="flex items-center gap-3">
            <img
              src={imgAdminLogo}
              alt="User"
              className="h-9 w-9 object-contain sm:h-10 sm:w-10"
            />
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

          <div className="relative z-10 flex w-full max-w-5xl flex-col items-center">
            <div className="w-full rounded-[32px] border-2 border-white/80 bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(234,234,234,0.49)_42.6%,rgba(245,245,245,0.96)_75.2%,rgba(255,255,255,0.41)_98.8%)] px-6 py-8 shadow-[0px_4px_28px_rgba(0,0,0,0.10)] backdrop-blur-[6px] sm:px-8">
              <div className="flex flex-col items-center gap-3">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#76c573] text-white shadow-lg">
                  <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
                    <path d="M6 6h15v10H6zM3 8h2v6H3zm4 10h10v2H7z" />
                  </svg>
                </div>

                <h1 className="text-center text-[32px] font-medium text-[#297525]">
                  Manage My Rentals
                </h1>

                <p className="text-center text-sm text-gray-500">
                  Start, complete, or cancel your reservations.
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
                              Provider:{" "}
                              <span className="font-semibold text-[#297525]">
                                {rental.providerName}
                              </span>
                            </p>

                            <p className="text-sm text-gray-500">
                              {rental.type} · {rental.city}, {rental.region}
                            </p>

                            <p className="text-sm text-gray-500">
                              Reserved on {formatDate(rental.reservedAt)}
                            </p>

                            <p className="text-sm text-gray-500">
                              Started at: {formatDate(rental.startedAt)}
                            </p>

                            <p className="text-sm text-gray-500">
                              Ended at: {formatDate(rental.endedAt)}
                            </p>

                            <p className="text-sm text-gray-500">
                              Payment: {rental.paymentMethod}
                            </p>

                            <p className="text-sm font-semibold text-[#297525]">
                              {rental.status === "completed"
                                ? `Final total: $${rental.total.toFixed(2)}`
                                : `Current total: $${Number(rental.total).toFixed(2)}`}
                            </p>
                          </div>

                          <div className="flex flex-col gap-2 lg:items-end">
                            <div className="rounded-full bg-[#f3f3f3] px-4 py-2 text-sm text-gray-500">
                              ${rental.pricePerHour}/h
                            </div>

                            {rental.status === "reserved" ? (
                              <>
                                <button
                                  onClick={() => handleStartRental(rental.id)}
                                  className="rounded-full bg-[#41a7ff] px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
                                >
                                  Start Rental
                                </button>

                                <button
                                  onClick={() => handleCancelRental(rental.id)}
                                  className="rounded-full bg-[#d4183d] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                                >
                                  Cancel Rental
                                </button>
                              </>
                            ) : rental.status === "active" ? (
                              <>
                                <button
                                  onClick={() => handleCompleteRental(rental.id)}
                                  className="rounded-full bg-[#165713] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#11440f]"
                                >
                                  Complete Rental
                                </button>

                                <button
                                  onClick={() => handleCancelRental(rental.id)}
                                  className="rounded-full bg-[#d4183d] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                                >
                                  Cancel Rental
                                </button>
                              </>
                            ) : (
                              <div className="rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-gray-400">
                                No action available
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
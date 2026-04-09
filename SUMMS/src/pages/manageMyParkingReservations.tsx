import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import imgLogo from "../assets/logo.png";
import AppHeader from "../component/AppHeader";
import { sessionService } from "../services/sessionService";
import {
  getParkingReservations,
  removeParkingReservation,
} from "../services/parkingStorage";
import type { ParkingReservation } from "../data/parking";

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleString();
}

export default function ManageMyParkingReservations() {
  const navigate = useNavigate();
  const currentUser = sessionService.getCurrentUser();
  const currentUserId = currentUser ? String(currentUser.id).trim() : "";

  const [reservations, setReservations] = useState<ParkingReservation[]>([]);
  const [message, setMessage] = useState("");

  function refreshReservations() {
    const allReservations = getParkingReservations();

    if (!currentUserId) {
      setReservations([]);
      return;
    }

    const userReservations = allReservations.filter(
      (reservation) => String(reservation.userId).trim() === currentUserId
    );

    setReservations(userReservations);
  }

  useEffect(() => {
    refreshReservations();
  }, [currentUserId]);

  const sortedReservations = useMemo(() => {
    return [...reservations].sort(
      (a, b) =>
        new Date(b.reservedAt).getTime() - new Date(a.reservedAt).getTime()
    );
  }, [reservations]);

  function handleCancelReservation(reservationId: string) {
    removeParkingReservation(reservationId);
    refreshReservations();
    setMessage("Parking reservation cancelled successfully.");
  }

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#f3f3f3]">
      <AppHeader />

      <div className="mx-auto w-full max-w-7xl px-4 pt-4 sm:px-6">
        <button
          onClick={() => navigate("/user")}
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
                    <path d="M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z" />
                  </svg>
                </div>

                <h1 className="text-center text-[32px] font-medium text-[#297525]">
                  Manage My Parking Reservations
                </h1>

                <p className="text-center text-sm text-gray-500">
                  View or cancel your parking reservations.
                </p>

                <button
                  onClick={() => navigate("/parking")}
                  className="mt-2 rounded-full bg-[#165713] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#11440f]"
                >
                  Go to Parking
                </button>
              </div>

              {message ? (
                <div className="mt-6 w-full rounded-full bg-white/80 px-5 py-3 text-center text-sm text-[#297525] shadow-[0px_4px_16px_rgba(0,0,0,0.08)]">
                  {message}
                </div>
              ) : null}

              <div className="mt-8">
                {sortedReservations.length === 0 ? (
                  <div className="mx-auto w-fit rounded-full bg-[#165713] px-6 py-2 text-sm font-semibold tracking-wide text-white shadow">
                    No parking reservations found
                  </div>
                ) : (
                  <div className="grid w-full grid-cols-1 gap-4">
                    {sortedReservations.map((reservation) => (
                      <div
                        key={reservation.id}
                        className="rounded-[28px] border-2 border-white/80 bg-white/70 px-6 py-5 shadow-[0px_4px_16px_rgba(0,0,0,0.08)]"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                          <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-3">
                              <p className="text-lg font-semibold text-[#297525]">
                                {reservation.lotName}
                              </p>
                              <span className="rounded-full bg-[#fff7d6] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#8a6d1f]">
                                reserved
                              </span>
                            </div>

                            <p className="text-sm text-gray-500">
                              City: {reservation.city}
                            </p>

                            <p className="text-sm text-gray-500">
                              Area: {reservation.area}
                            </p>

                            <p className="text-sm text-gray-500">
                              Address: {reservation.address}
                            </p>

                            <p className="text-sm text-gray-500">
                              Reserved on {formatDate(reservation.reservedAt)}
                            </p>

                            <p className="text-sm font-semibold text-[#297525]">
                              Current total: ${Number(reservation.pricePerHour).toFixed(2)}/h
                            </p>
                          </div>

                          <div className="flex flex-col gap-2 lg:items-end">
                            <div className="rounded-full bg-[#f3f3f3] px-4 py-2 text-sm text-gray-500">
                              ${reservation.pricePerHour.toFixed(2)}/h
                            </div>

                            <button
                              onClick={() => handleCancelReservation(reservation.id)}
                              className="rounded-full bg-[#d4183d] px-5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                            >
                              Cancel Reservation
                            </button>
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
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import imgLogo from "../assets/logo.png";
import AppHeader from "../component/AppHeader";
import {
  parkingLots,
  simulateParkingUpdates,
  type ParkingLot,
  type ParkingReservation,
} from "../data/parking";
import {
  addParkingReservation,
  getParkingReservations,
  removeParkingReservation,
} from "../services/parkingStorage";

const AREAS = ["All", "Downtown", "Old Montreal", "Le Plateau", "Laval", "Côte-des-Neiges"];

export default function Parking() {
  const navigate = useNavigate();

  const [lots, setLots] = useState<ParkingLot[]>(parkingLots);
  const [selectedArea, setSelectedArea] = useState("All");
  const [reservations, setReservations] = useState<ParkingReservation[]>([]);

  useEffect(() => {
    setReservations(getParkingReservations());
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLots((prev) => simulateParkingUpdates(prev));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const filteredLots = useMemo(() => {
    if (selectedArea === "All") return lots;
    return lots.filter((lot) => lot.area === selectedArea);
  }, [lots, selectedArea]);

  const totalSpots = useMemo(
    () => lots.reduce((sum, lot) => sum + lot.totalSpots, 0),
    [lots]
  );

  const totalAvailable = useMemo(
    () => lots.reduce((sum, lot) => sum + lot.availableSpots, 0),
    [lots]
  );

  const totalReserved = totalSpots - totalAvailable;

  const hasReservationForLot = (lotId: string) =>
    reservations.some((r) => r.lotId === lotId);

  const handleReserve = (lot: ParkingLot) => {
    if (lot.availableSpots <= 0) return;
    if (hasReservationForLot(lot.id)) return;

    const reservation: ParkingReservation = {
      id: `reservation-${Date.now()}`,
      lotId: lot.id,
      lotName: lot.name,
      reservedAt: new Date().toISOString(),
      pricePerHour: lot.pricePerHour,
    };

    addParkingReservation(reservation);
    setReservations(getParkingReservations());

    setLots((prev) =>
      prev.map((item) =>
        item.id === lot.id
          ? { ...item, availableSpots: Math.max(0, item.availableSpots - 1) }
          : item
      )
    );
  };

  const handleCancelReservation = (reservationId: string, lotId: string) => {
    removeParkingReservation(reservationId);
    setReservations(getParkingReservations());

    setLots((prev) =>
      prev.map((item) =>
        item.id === lotId
          ? {
              ...item,
              availableSpots: Math.min(item.totalSpots, item.availableSpots + 1),
            }
          : item
      )
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f3f3]">
      <div className="flex flex-col">
        <AppHeader />

        <main className="relative flex flex-1 flex-col items-center px-4 py-12 sm:px-6 lg:px-8">
          <img
            src={imgLogo}
            alt=""
            className="pointer-events-none absolute left-1/2 top-1/2 w-[700px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 opacity-20 sm:w-[820px] lg:w-[950px]"
          />

          <div className="relative z-10 flex w-full max-w-6xl flex-col gap-8">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#76c573] text-white shadow-lg">
                <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
                  <path d="M13 3H6v18h4v-6h3c3.31 0 6-2.69 6-6s-2.69-6-6-6zm.2 8H10V7h3.2c1.1 0 2 .9 2 2s-.9 2-2 2z" />
                </svg>
              </div>

              <h1 className="text-[32px] font-medium text-[#297525]">
                Parking Management
              </h1>

              <p className="max-w-xl text-sm text-gray-500">
                Real-time monitoring of parking availability, pricing, and reservations
                across Montreal and Laval.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-[24px] border-2 border-white/80 bg-white/80 p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.08)] backdrop-blur-[6px]">
                <p className="text-sm text-gray-500">Total Spots</p>
                <p className="mt-2 text-3xl font-semibold text-[#297525]">{totalSpots}</p>
              </div>

              <div className="rounded-[24px] border-2 border-white/80 bg-white/80 p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.08)] backdrop-blur-[6px]">
                <p className="text-sm text-gray-500">Available Now</p>
                <p className="mt-2 text-3xl font-semibold text-[#297525]">
                  {totalAvailable}
                </p>
              </div>

              <div className="rounded-[24px] border-2 border-white/80 bg-white/80 p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.08)] backdrop-blur-[6px]">
                <p className="text-sm text-gray-500">Reserved</p>
                <p className="mt-2 text-3xl font-semibold text-[#297525]">
                  {totalReserved}
                </p>
              </div>
            </div>

            <div className="rounded-[24px] border-2 border-white/80 bg-white/80 p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.08)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-lg font-semibold text-[#297525]">Filter by area</p>
                  <p className="text-sm text-gray-500">
                    View parking availability by location
                  </p>
                </div>

                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="h-11 rounded-full border border-gray-200 bg-white px-4 text-sm outline-none"
                >
                  {AREAS.map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[2fr_1fr]">
              <section className="flex flex-col gap-4">
                {filteredLots.map((lot) => {
                  const reserved = hasReservationForLot(lot.id);
                  const full = lot.availableSpots === 0;

                  return (
                    <div
                      key={lot.id}
                      className="rounded-[24px] border-2 border-white/80 bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(245,245,245,0.96)_75.2%,rgba(255,255,255,0.41)_98.8%)] p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.08)] backdrop-blur-[6px]"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-lg font-semibold text-[#297525]">{lot.name}</p>
                            <span className="rounded-full bg-[#e9f8e8] px-3 py-1 text-xs font-medium text-[#297525]">
                              {lot.area}
                            </span>
                          </div>

                          <p className="text-sm text-gray-500">{lot.address}</p>

                          <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
                            <span>
                              <strong>Available:</strong> {lot.availableSpots}/{lot.totalSpots}
                            </span>
                            <span>
                              <strong>Price:</strong> ${lot.pricePerHour.toFixed(2)}/hr
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col items-start gap-2 md:items-end">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              full
                                ? "bg-red-100 text-red-600"
                                : lot.availableSpots <= 5
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {full
                              ? "Full"
                              : lot.availableSpots <= 5
                              ? "Limited"
                              : "Available"}
                          </span>

                          <button
                            onClick={() => handleReserve(lot)}
                            disabled={full || reserved}
                            className={`h-11 rounded-full px-6 text-sm font-semibold text-white transition ${
                              full || reserved
                                ? "cursor-not-allowed bg-gray-400"
                                : "bg-[#76c573] hover:bg-[#5fb85c]"
                            }`}
                          >
                            {reserved ? "Reserved" : full ? "Unavailable" : "Reserve Spot"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </section>

              <aside className="rounded-[24px] border-2 border-white/80 bg-white/80 p-5 shadow-[0px_4px_20px_rgba(0,0,0,0.08)]">
                <div className="mb-4">
                  <p className="text-lg font-semibold text-[#297525]">My Reservations</p>
                  <p className="text-sm text-gray-500">
                    Your saved parking reservations
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {reservations.length === 0 ? (
                    <div className="rounded-[18px] bg-[#f7f7f7] p-4 text-sm text-gray-500">
                      No reservations yet.
                    </div>
                  ) : (
                    reservations.map((reservation) => (
                      <div
                        key={reservation.id}
                        className="rounded-[18px] border border-gray-100 bg-[#f9fdf8] p-4"
                      >
                        <p className="font-semibold text-[#297525]">
                          {reservation.lotName}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          ${reservation.pricePerHour.toFixed(2)}/hr
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          Reserved on{" "}
                          {new Date(reservation.reservedAt).toLocaleString()}
                        </p>

                        <button
                          onClick={() =>
                            handleCancelReservation(reservation.id, reservation.lotId)
                          }
                          className="mt-3 rounded-full bg-red-500 px-4 py-2 text-xs font-semibold text-white hover:bg-red-600"
                        >
                          Cancel Reservation
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
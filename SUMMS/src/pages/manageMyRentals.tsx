import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import imgLogo from "../assets/logo.png";
import { sessionService } from "../services/sessionService";
import { safetyModeService, type SafetyShareSession } from "../services/safetyModeService";
import AppHeader from "../component/AppHeader";

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

function getSafetyBadgeClasses(session: SafetyShareSession | null) {
  if (!session || !session.isEnabled) return "bg-gray-100 text-gray-500";
  if (session.emergency) return "bg-[#ffe0e6] text-[#b4233c]";
  if (session.isLive) return "bg-[#dff5df] text-[#297525]";
  return "bg-[#eef6df] text-[#5b8a2d]";
}

function buildSharedWithText(session: SafetyShareSession | null) {
  if (!session || !session.isEnabled) return "Safety Off";
  if (session.emergency) return "Emergency";
  if (session.isLive) return "Live Sharing";

  const names = session.trustedContacts
    .map((contact) => contact.fullName.trim().split(" ")[0])
    .filter(Boolean);

  if (names.length === 0) return "Safety On";
  if (names.length === 1) return `Shared with ${names[0]}`;
  if (names.length === 2) return `Shared with ${names[0]} and ${names[1]}`;
  return `Shared with ${names[0]}, ${names[1]} and ${names[2]}`;
}

function formatDate(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
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

const primaryBtn =
  "rounded-full px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90";
const softBtn =
  "rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-[#165713] transition hover:bg-gray-50";
const stageBtn =
  "rounded-full px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90";

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
    const userRentals = allRentals.filter(
      (rental) => String(rental.userId).trim() === currentUserId
    );

    setRentals(userRentals);
  }

  useEffect(() => {
    refreshRentals();
  }, [userId]);

  const sortedRentals = useMemo(() => {
    return [...rentals].sort(
      (a, b) => new Date(b.reservedAt).getTime() - new Date(a.reservedAt).getTime()
    );
  }, [rentals]);

  function handleStartRental(rentalId: string) {
    const allRentals = getStoredRentals();

    const updatedRentals = allRentals.map((rental) => {
      if (rental.id !== rentalId || rental.status !== "reserved") return rental;

      return {
        ...rental,
        status: "active" as RentalStatus,
        startedAt: new Date().toISOString(),
      };
    });

    saveStoredRentals(updatedRentals);
    safetyModeService.startLiveSharing(rentalId);
    refreshRentals();
    setMessage("Rental started. Trusted contacts were notified that live sharing began.");
  }

  function handleCompleteRental(rentalId: string) {
    const allRentals = getStoredRentals();

    const updatedRentals = allRentals.map((rental) => {
      if (rental.id !== rentalId || rental.status !== "active") return rental;

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
    safetyModeService.stopLiveSharing(rentalId);
    refreshRentals();
    setMessage("Rental completed. You can now only review the trip summary.");
  }

  function handleCancelRental(rentalId: string) {
    const allRentals = getStoredRentals();

    const updatedRentals = allRentals.map((rental) => {
      if (rental.id !== rentalId) return rental;
      if (rental.status === "completed" || rental.status === "cancelled") return rental;

      return {
        ...rental,
        status: "cancelled" as RentalStatus,
        endedAt: rental.status === "active" ? new Date().toISOString() : rental.endedAt,
      };
    });

    saveStoredRentals(updatedRentals);
    safetyModeService.stopLiveSharing(rentalId);
    refreshRentals();
    setMessage("Rental cancelled and live sharing stopped.");
  }

  function handleStopLiveSharing(rentalId: string) {
    const updated = safetyModeService.stopLiveSharing(rentalId);

    if (!updated) {
      setMessage("No live safety session found for this rental.");
      return;
    }

    refreshRentals();
    setMessage("Live sharing stopped.");
  }

  function handleEmergency(rentalId: string) {
    const updated = safetyModeService.triggerEmergency(rentalId);

    if (!updated) {
      setMessage("Emergency can only be triggered during an active live sharing session.");
      return;
    }

    refreshRentals();
    setMessage("Emergency alert triggered. Trusted contacts were notified immediately.");
  }

  function handleCopyShareLink(rentalId: string) {
    const session = safetyModeService.getSessionByRentalId(rentalId);

    if (!session) {
      setMessage("No Safety Mode session found for this rental.");
      return;
    }

    navigator.clipboard.writeText(safetyModeService.buildShareLink(session.token));
    setMessage("Share link copied to clipboard.");
  }

  function handleViewSharedTrip(rentalId: string) {
    const session = safetyModeService.getSessionByRentalId(rentalId);

    if (!session) {
      setMessage("No Safety Mode session found for this rental.");
      return;
    }

    navigate(`/trip-share/${session.token}`);
  }

  function handleStageUpdate(
    rentalId: string,
    stage: "En route" | "Near destination" | "Arrived safely",
  ) {
    const updated = safetyModeService.updateStage(rentalId, stage);

    if (!updated) {
      setMessage("Trip stages can only be updated during live sharing.");
      return;
    }

    refreshRentals();
    setMessage(`Stage updated to "${stage}". Trusted contacts were notified.`);
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

        <main className="relative flex flex-1 flex-col items-center px-4 py-10 sm:px-6 lg:px-8">
          <img
            src={imgLogo}
            alt=""
            className="pointer-events-none absolute left-1/2 top-1/2 w-[700px] max-w-[90vw] -translate-x-1/2 -translate-y-1/2 opacity-30 sm:w-[820px] lg:w-[950px]"
          />

          <div className="relative z-10 flex w-full max-w-6xl flex-col items-center">
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
                  Start, complete, cancel, and safely share your reservations.
                </p>
              </div>

              {message ? (
                <div className="mx-auto mt-6 w-full max-w-5xl rounded-2xl bg-white/85 px-5 py-3 text-center text-sm text-[#297525] shadow-[0px_4px_16px_rgba(0,0,0,0.06)]">
                  {message}
                </div>
              ) : null}

              <div className="mt-8 space-y-5">
                {sortedRentals.length === 0 ? (
                  <div className="mx-auto w-fit rounded-full bg-[#165713] px-6 py-2 text-sm font-semibold tracking-wide text-white shadow">
                    No rentals found
                  </div>
                ) : (
                  sortedRentals.map((rental) => {
                    const safetySession = safetyModeService.getSessionByRentalId(rental.id);
                    const isClosed =
                      rental.status === "completed" || rental.status === "cancelled";

                    return (
                      <div
                        key={rental.id}
                        className="rounded-[30px] border border-white/70 bg-white/75 p-6 shadow-[0px_8px_24px_rgba(0,0,0,0.06)]"
                      >
                        <div className="flex flex-col gap-6">
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-wrap items-center gap-2">
                              <h2 className="text-2xl font-semibold text-[#297525]">
                                {rental.vehicleName}
                              </h2>
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${getStatusClasses(rental.status)}`}>
                                {rental.status}
                              </span>
                              <span className={`rounded-full px-3 py-1 text-xs font-semibold tracking-wide ${getSafetyBadgeClasses(safetySession)}`}>
                                {buildSharedWithText(safetySession)}
                              </span>
                            </div>

                            <div className="grid gap-x-10 gap-y-2 text-sm text-gray-500 md:grid-cols-2">
                              <p>
                                Provider:{" "}
                                <span className="font-semibold text-[#297525]">
                                  {rental.providerName}
                                </span>
                              </p>
                              <p>
                                {rental.type} · {rental.city}, {rental.region}
                              </p>
                              <p>Reserved on {formatDate(rental.reservedAt)}</p>
                              <p>Started at: {formatDate(rental.startedAt)}</p>
                              <p>Ended at: {formatDate(rental.endedAt)}</p>
                              <p>Payment: {rental.paymentMethod}</p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3">
                              <div className="rounded-full bg-[#f3f3f3] px-4 py-2 text-sm text-gray-500">
                                ${rental.pricePerHour}/h
                              </div>
                              <div className="text-sm font-semibold text-[#297525]">
                                {rental.status === "completed"
                                  ? `Final total: $${rental.total.toFixed(2)}`
                                  : `Current total: $${Number(rental.total).toFixed(2)}`}
                              </div>
                            </div>
                          </div>

                          <div className="grid gap-4 lg:grid-cols-3">
                            <div className="rounded-2xl bg-[#fafafa] p-4">
                              <p className="mb-3 text-sm font-semibold text-[#297525]">
                                Rental Actions
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {rental.status === "reserved" && (
                                  <>
                                    <button
                                      onClick={() => handleStartRental(rental.id)}
                                      className={`${primaryBtn} bg-[#41a7ff]`}
                                    >
                                      Start Rental
                                    </button>
                                    <button
                                      onClick={() => handleCancelRental(rental.id)}
                                      className={`${primaryBtn} bg-[#d4183d]`}
                                    >
                                      Cancel Rental
                                    </button>
                                  </>
                                )}

                                {rental.status === "active" && (
                                  <>
                                    <button
                                      onClick={() => handleCompleteRental(rental.id)}
                                      className={`${primaryBtn} bg-[#165713]`}
                                    >
                                      Complete Rental
                                    </button>
                                    <button
                                      onClick={() => handleCancelRental(rental.id)}
                                      className={`${primaryBtn} bg-[#d4183d]`}
                                    >
                                      Cancel Rental
                                    </button>
                                  </>
                                )}

                                {isClosed && (
                                  <div className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-gray-400">
                                    No action available
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="rounded-2xl bg-[#fafafa] p-4">
                              <p className="mb-3 text-sm font-semibold text-[#297525]">
                                Safety Sharing
                              </p>

                              <div className="flex flex-wrap gap-2">
                                {!isClosed && safetySession?.isLive && (
                                  <>
                                    <button
                                      onClick={() => handleStopLiveSharing(rental.id)}
                                      className={`${primaryBtn} bg-[#8a6d1f]`}
                                    >
                                      Stop Live Sharing
                                    </button>
                                    <button
                                      onClick={() => handleCopyShareLink(rental.id)}
                                      className={softBtn}
                                    >
                                      Copy Link
                                    </button>
                                    <button
                                      onClick={() => handleViewSharedTrip(rental.id)}
                                      className={softBtn}
                                    >
                                      View Trip
                                    </button>
                                    <button
                                      onClick={() => handleEmergency(rental.id)}
                                      className={`${primaryBtn} bg-[#d4183d]`}
                                    >
                                      Emergency
                                    </button>
                                  </>
                                )}

                                {isClosed && safetySession && (
                                  <button
                                    onClick={() => handleViewSharedTrip(rental.id)}
                                    className={softBtn}
                                  >
                                    View Trip Summary
                                  </button>
                                )}

                                {!isClosed && safetySession && !safetySession.isLive && (
                                  <>
                                    <button
                                      onClick={() => handleCopyShareLink(rental.id)}
                                      className={softBtn}
                                    >
                                      Copy Link
                                    </button>
                                    <button
                                      onClick={() => handleViewSharedTrip(rental.id)}
                                      className={softBtn}
                                    >
                                      View Trip
                                    </button>
                                  </>
                                )}
                              </div>

                              {isClosed ? (
                                <p className="mt-3 text-xs text-gray-500">
                                  This rental is closed. You can only review the trip summary.
                                </p>
                              ) : !safetySession?.isLive ? (
                                <p className="mt-3 text-xs text-gray-500">
                                  Live sharing begins automatically when the rental starts.
                                </p>
                              ) : null}
                            </div>

                            <div className="rounded-2xl bg-[#fafafa] p-4">
                              <p className="mb-3 text-sm font-semibold text-[#297525]">
                                Trip Updates
                              </p>

                              {!isClosed && safetySession?.isLive ? (
                                <>
                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      onClick={() => handleStageUpdate(rental.id, "En route")}
                                      className={`${stageBtn} bg-[#5f95eb]`}
                                    >
                                      En Route
                                    </button>
                                    <button
                                      onClick={() => handleStageUpdate(rental.id, "Near destination")}
                                      className={`${stageBtn} bg-[#4c8b2c]`}
                                    >
                                      Near Destination
                                    </button>
                                    <button
                                      onClick={() => handleStageUpdate(rental.id, "Arrived safely")}
                                      className={`${stageBtn} bg-[#2f6d18]`}
                                    >
                                      Arrived Safely
                                    </button>
                                  </div>
                                  <p className="mt-3 text-xs text-gray-500">
                                    Each update immediately notifies trusted contacts.
                                  </p>
                                </>
                              ) : (
                                <p className="text-xs text-gray-500">
                                  {isClosed
                                    ? "Trip updates are no longer available after the rental ends."
                                    : "Trip updates become available during live sharing."}
                                </p>
                              )}
                            </div>
                          </div>

                          {safetySession && (
                            <div className="rounded-2xl bg-[#f7faf7] p-5 text-sm text-gray-600">
                              <p className="mb-4 font-semibold text-[#297525]">
                                Safety Mode Details
                              </p>

                              <div className="grid gap-x-8 gap-y-3 md:grid-cols-3">
                                <div>
                                  <p className="text-xs uppercase tracking-wide text-gray-400">Stage</p>
                                  <p className="mt-1 font-medium">{safetySession.stage}</p>
                                </div>

                                <div>
                                  <p className="text-xs uppercase tracking-wide text-gray-400">Shared with</p>
                                  <p className="mt-1 font-medium">
                                    {safetySession.trustedContacts
                                      .map((contact) => contact.fullName)
                                      .join(", ")}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs uppercase tracking-wide text-gray-400">Expected return</p>
                                  <p className="mt-1 font-medium">{formatDate(safetySession.expectedReturnAt)}</p>
                                </div>

                                <div>
                                  <p className="text-xs uppercase tracking-wide text-gray-400">Last update</p>
                                  <p className="mt-1 font-medium">{formatDate(safetySession.lastUpdatedAt)}</p>
                                </div>

                                <div>
                                  <p className="text-xs uppercase tracking-wide text-gray-400">Contacts notified</p>
                                  <p className="mt-1 font-medium">{safetySession.trustedContacts.length}</p>
                                </div>

                                <div>
                                  <p className="text-xs uppercase tracking-wide text-gray-400">Total messages</p>
                                  <p className="mt-1 font-medium">{safetySession.notifications.length}</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
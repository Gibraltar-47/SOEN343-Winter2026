import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import imgLogo from "../assets/logo.png";
import imgAdminLogo from "../assets/adminLogo.png";
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

function formatDate(value?: string) {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString();
}

export default function ProviderProfit() {
  const navigate = useNavigate();
  const currentUser = sessionService.getCurrentUser();
  const providerId = currentUser?.id;

  const [rentals, setRentals] = useState<ProviderRental[]>([]);

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

  const completedRentals = useMemo(() => {
    return rentals
      .filter((rental) => rental.status === "completed")
      .sort(
        (a, b) =>
          new Date(b.endedAt || b.reservedAt).getTime() -
          new Date(a.endedAt || a.reservedAt).getTime(),
      );
  }, [rentals]);

  const totalProfit = useMemo(() => {
    return completedRentals.reduce((sum, rental) => sum + Number(rental.total || 0), 0);
  }, [completedRentals]);

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#f3f3f3]">
      <div className="flex flex-col">
        <header className="flex h-[72px] items-center justify-between bg-[#76c573] px-4 shadow-[0px_4px_25px_rgba(0,0,0,0.18)] sm:px-6">
          <button
            onClick={() => navigate("/provider")}
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
              alt="Provider"
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
                    <path d="M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                  </svg>
                </div>

                <h1 className="text-center text-[32px] font-medium text-[#297525]">
                  Provider Profit
                </h1>

                <p className="text-center text-sm text-gray-500">
                  Revenue earned from completed rentals.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="rounded-[24px] bg-white/75 p-5 shadow text-center">
                  <p className="text-sm text-gray-500">Completed rentals</p>
                  <p className="mt-2 text-3xl font-semibold text-[#297525]">
                    {completedRentals.length}
                  </p>
                </div>

                <div className="rounded-[24px] bg-white/75 p-5 shadow text-center md:col-span-2">
                  <p className="text-sm text-gray-500">Total profit</p>
                  <p className="mt-2 text-3xl font-semibold text-[#165713]">
                    ${totalProfit.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                {completedRentals.length === 0 ? (
                  <div className="mx-auto w-fit rounded-full bg-[#165713] px-6 py-2 text-sm font-semibold tracking-wide text-white shadow">
                    No completed rentals yet
                  </div>
                ) : (
                  <div className="grid w-full grid-cols-1 gap-4">
                    {completedRentals.map((rental) => (
                      <div
                        key={rental.id}
                        className="rounded-[28px] border-2 border-white/80 bg-white/70 px-6 py-5 shadow-[0px_4px_16px_rgba(0,0,0,0.08)]"
                      >
                        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                          <div className="space-y-2">
                            <p className="text-lg font-semibold text-[#297525]">
                              {rental.vehicleName}
                            </p>

                            <p className="text-sm text-gray-500">
                              Customer:{" "}
                              <span className="font-semibold text-[#297525]">
                                {rental.userName}
                              </span>
                            </p>

                            <p className="text-sm text-gray-500">
                              Started at: {formatDate(rental.startedAt)}
                            </p>

                            <p className="text-sm text-gray-500">
                              Ended at: {formatDate(rental.endedAt)}
                            </p>
                          </div>

                          <div className="rounded-full bg-[#dff5df] px-5 py-2 text-sm font-semibold text-[#297525]">
                            ${Number(rental.total).toFixed(2)}
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
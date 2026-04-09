import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import imgLogo from "../assets/logo.png";
import AppHeader from "../component/AppHeader";
import { getAdminDashboardSummary } from "../services/adminDashboardService";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const summary = useMemo(() => getAdminDashboardSummary(), []);

  return (
    <div className="min-h-screen w-full bg-[#f3f3f3]">
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
                <path d="M12 2 3 7v6c0 5 3.8 9.7 9 11 5.2-1.3 9-6 9-11V7l-9-5Z" />
              </svg>
            </div>

            <h1 className="text-[32px] font-medium text-[#297525]">
              Administrative Dashboard
            </h1>

            <p className="max-w-2xl text-sm text-gray-500">
              Tools for city officials to monitor system performance, enforce
              policies, and evaluate sustainability goals.
            </p>
          </div>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="rounded-[24px] p-6 bg-white shadow text-center">
              <p className="text-sm text-gray-500">Active Rentals</p>
              <p className="text-2xl font-bold text-[#165713]">
                {summary.activeRentals}
              </p>
            </div>

            <div className="rounded-[24px] p-6 bg-white shadow text-center">
              <p className="text-sm text-gray-500">Completed Rentals</p>
              <p className="text-2xl font-bold text-[#165713]">
                {summary.completedRentals}
              </p>
            </div>

            <div className="rounded-[24px] p-6 bg-white shadow text-center">
              <p className="text-sm text-gray-500">Payment Attempts</p>
              <p className="text-2xl font-bold text-[#165713]">
                {summary.paymentAttempts}
              </p>
            </div>

            <div className="rounded-[24px] p-6 bg-white shadow text-center">
              <p className="text-sm text-gray-500">Successful Payments</p>
              <p className="text-2xl font-bold text-[#165713]">
                {summary.successfulPayments}
              </p>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-[24px] p-6 bg-white shadow text-center">
              <p className="text-sm text-gray-500">Total Registered Users</p>
              <p className="text-3xl font-bold text-[#165713]">
                {summary.totalRegisteredUsers}
              </p>
            </div>

            <div className="rounded-[24px] p-6 bg-white shadow text-center">
              <p className="text-sm text-gray-500">Number of Completed Trips</p>
              <p className="text-3xl font-bold text-[#165713]">
                {summary.numberOfCompletedTrips}
              </p>
            </div>
          </section>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <section className="rounded-[28px] border-2 border-white/80 bg-white/80 p-6 shadow">
              <h2 className="text-xl font-semibold text-[#297525]">
                Active Rentals by City
              </h2>

              <div className="mt-5 flex flex-col gap-3">
                {summary.activeRentalsByCity.length === 0 ? (
                  <p className="text-sm text-gray-500">No active rentals found.</p>
                ) : (
                  summary.activeRentalsByCity.map((item) => (
                    <div
                      key={item.city}
                      className="flex items-center justify-between rounded-[18px] bg-[#f7f7f7] px-4 py-3"
                    >
                      <span className="text-sm text-gray-600">{item.city}</span>
                      <span className="font-semibold text-[#297525]">
                        {item.count}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </section>

            <section className="rounded-[28px] border-2 border-white/80 bg-white/80 p-6 shadow">
              <h2 className="text-xl font-semibold text-[#297525]">
                Parking Utilization per City
              </h2>

              <div className="mt-5 flex flex-col gap-3">
                {summary.parkingUtilizationByCity.map((item) => (
                  <div
                    key={item.city}
                    className="rounded-[18px] bg-[#f7f7f7] px-4 py-4"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{item.city}</span>
                      <span className="font-semibold text-[#297525]">
                        {item.utilizationPercent}%
                      </span>
                    </div>

                    <p className="mt-2 text-xs text-gray-500">
                      {item.reservedSpots} reserved out of {item.totalSpots} total spots
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <section className="rounded-[28px] border-2 border-white/80 bg-white/80 p-6 shadow">
            <h2 className="text-xl font-semibold text-[#297525]">
              Usage Comparison Between Bikes and Scooters
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-[20px] bg-[#f7f7f7] p-5 text-center">
                <p className="text-sm text-gray-500">Bike Usage</p>
                <p className="mt-2 text-3xl font-semibold text-[#297525]">
                  {summary.bikesVsScooters.bikes}
                </p>
              </div>

              <div className="rounded-[20px] bg-[#f7f7f7] p-5 text-center">
                <p className="text-sm text-gray-500">Scooter Usage</p>
                <p className="mt-2 text-3xl font-semibold text-[#297525]">
                  {summary.bikesVsScooters.scooters}
                </p>
              </div>
            </div>
          </section>

          <div className="flex justify-center">
            <button
              onClick={() => navigate("/home")}
              className="rounded-full bg-[#165713] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#11440f]"
            >
              Back to Home
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
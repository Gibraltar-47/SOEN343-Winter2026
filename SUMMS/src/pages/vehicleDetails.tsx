import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import imgLogo from '../assets/logo.png';
import imgAdminLogo from '../assets/adminLogo.png';
import { getAllVehicles } from '../services/providerVehicleService';

export default function VehicleDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const vehicleFromState = (location.state as { vehicle?: any } | null)?.vehicle;
  const allVehicles = React.useMemo(() => getAllVehicles(), []);
  const vehicle = vehicleFromState || allVehicles.find((v) => v.id === id);

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#f3f3f3]">
        <main className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-xl rounded-[28px] border-2 border-white/80 bg-white/80 p-8 text-center shadow-[0px_4px_26px_rgba(0,0,0,0.10)]">
            <h1 className="text-3xl font-semibold text-[#297525]">Vehicle not found</h1>
            <button
              onClick={() => navigate('/vehicle-search')}
              className="mt-6 rounded-full bg-[#1fae19] px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Back to Search
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f3f3]">
      <header className="flex h-[72px] items-center justify-between bg-[#76c573] px-4 shadow-[0px_4px_25px_rgba(0,0,0,0.18)] sm:px-6">
        <div>
          <p className="text-lg font-semibold text-white">SUMMS Vehicle Details</p>
          <p className="text-xs text-white/80">Review vehicle information before reserving</p>
        </div>

        <div className="flex items-center gap-3">
          <img src={imgAdminLogo} alt="Admin" className="h-9 w-9 object-contain sm:h-10 sm:w-10" />
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#165713] text-white sm:h-10 sm:w-10">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
              <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Zm0 2c-3.866 0-7 3.134-7 7 0 .552.448 1 1 1h12c.552 0 1-.448 1-1 0-3.866-3.134-7-7-7Z" />
            </svg>
          </div>
        </div>
      </header>

      <main className="relative px-4 py-8 sm:px-6 lg:px-8">
        <img
          src={imgLogo}
          alt=""
          className="pointer-events-none absolute left-1/2 top-[260px] w-[720px] max-w-[90vw] -translate-x-1/2 opacity-20"
        />

        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8">
          <section className="rounded-[32px] border-2 border-white/80 bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(234,234,234,0.49)_42.6%,rgba(245,245,245,0.96)_75.2%,rgba(255,255,255,0.41)_98.8%)] p-6 shadow-[0px_4px_35px_rgba(0,0,0,0.12)] backdrop-blur-[6px]">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="inline-flex w-fit rounded-full bg-[#165713] px-4 py-1 text-xs font-semibold tracking-wide text-white">
                  Step 2 · Vehicle Details
                </p>
                <h1 className="mt-3 text-3xl font-semibold text-[#297525]">{vehicle.name}</h1>
                <p className="mt-2 text-sm text-gray-500">
                  {vehicle.type} · {vehicle.city}, {vehicle.region} · {vehicle.provider}
                </p>
              </div>

              <button
                onClick={() => navigate('/vehicle-search')}
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#297525] shadow hover:bg-gray-100"
              >
                Back to Search
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px,1fr]">
              <div className="rounded-[28px] bg-white/75 p-6 text-center shadow">
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-[#76c573] text-6xl shadow-lg">
                  {vehicle.image}
                </div>
                <p className="mt-4 text-2xl font-semibold text-[#297525]">${vehicle.pricePerHour}/hour</p>
                <p className="mt-2 text-sm text-gray-500">
                  {vehicle.available ? 'Available now' : 'Currently unavailable'}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-[24px] bg-white/75 p-5 shadow">
                  <p className="font-semibold text-[#297525]">Distance</p>
                  <p className="mt-1 text-gray-600">{vehicle.distanceKm} km away</p>
                </div>
                <div className="rounded-[24px] bg-white/75 p-5 shadow">
                  <p className="font-semibold text-[#297525]">Range</p>
                  <p className="mt-1 text-gray-600">{vehicle.rangeKm} km</p>
                </div>
                <div className="rounded-[24px] bg-white/75 p-5 shadow">
                  <p className="font-semibold text-[#297525]">Rating</p>
                  <p className="mt-1 text-gray-600">★ {vehicle.rating}</p>
                </div>
                <div className="rounded-[24px] bg-white/75 p-5 shadow">
                  <p className="font-semibold text-[#297525]">Type</p>
                  <p className="mt-1 text-gray-600">{vehicle.type}</p>
                </div>
                {vehicle.seats && (
                  <div className="rounded-[24px] bg-white/75 p-5 shadow">
                    <p className="font-semibold text-[#297525]">Seats</p>
                    <p className="mt-1 text-gray-600">{vehicle.seats}</p>
                  </div>
                )}
                {vehicle.transmission && (
                  <div className="rounded-[24px] bg-white/75 p-5 shadow">
                    <p className="font-semibold text-[#297525]">Transmission</p>
                    <p className="mt-1 text-gray-600">{vehicle.transmission}</p>
                  </div>
                )}
                {vehicle.fuel && (
                  <div className="rounded-[24px] bg-white/75 p-5 shadow">
                    <p className="font-semibold text-[#297525]">Fuel</p>
                    <p className="mt-1 text-gray-600">{vehicle.fuel}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 rounded-[24px] bg-white/75 p-5 shadow">
              <h2 className="text-lg font-semibold text-[#297525]">Description</h2>
              <p className="mt-2 text-gray-600">{vehicle.description}</p>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="rounded-[24px] bg-white/75 p-5 shadow">
                <h2 className="text-lg font-semibold text-[#297525]">Features</h2>
                <ul className="mt-3 space-y-2 text-gray-600">
                  {vehicle.features.map((feature: string) => (
                    <li key={feature}>• {feature}</li>
                  ))}
                </ul>
              </div>

              <div className="rounded-[24px] bg-white/75 p-5 shadow">
                <h2 className="text-lg font-semibold text-[#297525]">Policies</h2>
                <ul className="mt-3 space-y-2 text-gray-600">
                  {vehicle.policies.map((policy: string) => (
                    <li key={policy}>• {policy}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/vehicle-search')}
                className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#297525] shadow hover:bg-gray-100"
              >
                Back to Search
              </button>

              <button
                onClick={() => 
                  navigate('/payment', {
                    state: { 
                      vehicleId: vehicle.id,
                      vehicleName: vehicle.name,
                      city: vehicle.city,
                      region: vehicle.region,
                      pricePerHour: vehicle.pricePerHour,
                      providerId: vehicle.providerId,
                      providerName: vehicle.providerName ?? vehicle.provider,
                      type: vehicle.type,
                    },
                  })
                }
                className="rounded-full bg-[#1fae19] px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Reserve Vehicle
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
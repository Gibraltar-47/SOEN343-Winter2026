import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imgLogo from '../assets/logo.png';
import imgAdminLogo from '../assets/adminLogo.png';
import { cities, vehicles, vehicleTypes } from '../data/vehicles';

function SearchField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-[#297525]">
      <span>{label}</span>
      {children}
    </label>
  );
}

const inputClassName =
  'h-12 w-full rounded-full border-2 border-[#cfcfcf] bg-white/95 px-4 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#76c573] focus:ring-2 focus:ring-[#76c573]/30';

export default function VehicleSearch() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');
  const [dropoffTime, setDropoffTime] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((vehicle) => (selectedType ? vehicle.type === selectedType : true))
      .filter((vehicle) => (selectedCity ? vehicle.city === selectedCity : true))
      .filter((vehicle) => (minPrice ? vehicle.pricePerHour >= Number(minPrice) : true))
      .filter((vehicle) => (maxPrice ? vehicle.pricePerHour <= Number(maxPrice) : true))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [selectedType, selectedCity, minPrice, maxPrice]);

  const hasEnteredDates = Boolean(pickupDate && pickupTime && dropoffDate && dropoffTime);

  return (
    <div className="min-h-screen w-full bg-[#f3f3f3]">
      <header className="flex h-[72px] items-center justify-between bg-[#76c573] px-4 shadow-[0px_4px_25px_rgba(0,0,0,0.18)] sm:px-6">
        <div>
          <p className="text-lg font-semibold text-white">SUMMS Vehicle Search</p>
          <p className="text-xs text-white/80">Browse, compare, and reserve mobility options</p>
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
          className="pointer-events-none absolute left-1/2 top-[280px] w-[720px] max-w-[90vw] -translate-x-1/2 opacity-20"
        />

        <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-8">
          <section className="rounded-[32px] border-2 border-white/80 bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(234,234,234,0.49)_42.6%,rgba(245,245,245,0.96)_75.2%,rgba(255,255,255,0.41)_98.8%)] p-6 shadow-[0px_4px_35px_rgba(0,0,0,0.12)] backdrop-blur-[6px]">
            <div className="mb-6 flex flex-col gap-2">
              <p className="inline-flex w-fit rounded-full bg-[#165713] px-4 py-1 text-xs font-semibold tracking-wide text-white">
                Step 1 · Vehicle Search
              </p>
              <h1 className="text-3xl font-semibold text-[#297525]">Find a vehicle that matches your needs</h1>
              <p className="max-w-3xl text-sm text-gray-500">
                Search by vehicle type, city, dates, and price range. Results are sorted by nearest match so the user can quickly view details and continue the rental lifecycle.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              <SearchField label="Vehicle Type">
                <select className={inputClassName} value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                  <option value="">All types</option>
                  {vehicleTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </SearchField>

              <SearchField label="City">
                <select className={inputClassName} value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                  <option value="">All cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </SearchField>

              <SearchField label="Pickup Date">
                <input className={inputClassName} type="date" value={pickupDate} onChange={(e) => setPickupDate(e.target.value)} />
              </SearchField>

              <SearchField label="Pickup Time">
                <input className={inputClassName} type="time" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} />
              </SearchField>

              <SearchField label="Drop-off Date">
                <input className={inputClassName} type="date" value={dropoffDate} onChange={(e) => setDropoffDate(e.target.value)} />
              </SearchField>

              <SearchField label="Drop-off Time">
                <input className={inputClassName} type="time" value={dropoffTime} onChange={(e) => setDropoffTime(e.target.value)} />
              </SearchField>

              <SearchField label="Minimum Price / hour">
                <input className={inputClassName} type="number" min="0" placeholder="e.g. 5" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
              </SearchField>

              <SearchField label="Maximum Price / hour">
                <input className={inputClassName} type="number" min="0" placeholder="e.g. 25" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
              </SearchField>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setSelectedType('');
                  setSelectedCity('');
                  setPickupDate('');
                  setPickupTime('');
                  setDropoffDate('');
                  setDropoffTime('');
                  setMinPrice('');
                  setMaxPrice('');
                }}
                className="h-11 rounded-full bg-[#41a7ff] px-6 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                Reset Filters
              </button>
              <button
                onClick={() => navigate('/home')}
                className="h-11 rounded-full bg-[#1fae19] px-6 text-sm font-semibold text-white transition hover:bg-green-700"
              >
                Back to Home
              </button>
            </div>
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-[320px,1fr]">
            <div className="rounded-[28px] border-2 border-white/80 bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(245,245,245,0.96)_75.2%)] p-6 shadow-[0px_4px_30px_rgba(0,0,0,0.10)] backdrop-blur-[6px]">
              <h2 className="text-xl font-semibold text-[#297525]">Search Summary</h2>
              <div className="mt-4 space-y-3 text-sm text-gray-600">
                <p><span className="font-semibold text-[#297525]">Type:</span> {selectedType || 'Any'}</p>
                <p><span className="font-semibold text-[#297525]">City:</span> {selectedCity || 'Any'}</p>
                <p><span className="font-semibold text-[#297525]">Dates:</span> {hasEnteredDates ? `${pickupDate} ${pickupTime} → ${dropoffDate} ${dropoffTime}` : 'Not selected yet'}</p>
                <p><span className="font-semibold text-[#297525]">Price:</span> {minPrice || maxPrice ? `$${minPrice || '0'} - $${maxPrice || '∞'} / hour` : 'Any budget'}</p>
              </div>
              <div className="mt-5 rounded-[24px] bg-white/75 p-4 text-sm text-gray-500">
                {filteredVehicles.length} vehicle{filteredVehicles.length === 1 ? '' : 's'} match the current filters.
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
              {filteredVehicles.map((vehicle) => (
                <article
                  key={vehicle.id}
                  className="rounded-[28px] border-2 border-white/80 bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(245,245,245,0.96)_75.2%)] p-5 shadow-[0px_4px_26px_rgba(0,0,0,0.10)] backdrop-blur-[6px]"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#76c573] text-3xl shadow-lg">
                        {vehicle.image}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[#297525]">{vehicle.name}</h3>
                        <p className="text-sm text-gray-500">{vehicle.type} · {vehicle.city}, {vehicle.region}</p>
                        <p className="text-xs text-gray-400">{vehicle.provider}</p>
                      </div>
                    </div>
                    <div className="rounded-full bg-[#165713] px-3 py-1 text-xs font-semibold text-white">
                      ★ {vehicle.rating}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                    <div className="rounded-2xl bg-white/70 p-3">
                      <p className="font-semibold text-[#297525]">Price</p>
                      <p>${vehicle.pricePerHour} / hour</p>
                    </div>
                    <div className="rounded-2xl bg-white/70 p-3">
                      <p className="font-semibold text-[#297525]">Distance</p>
                      <p>{vehicle.distanceKm} km away</p>
                    </div>
                    <div className="rounded-2xl bg-white/70 p-3">
                      <p className="font-semibold text-[#297525]">Range</p>
                      <p>{vehicle.rangeKm} km</p>
                    </div>
                    <div className="rounded-2xl bg-white/70 p-3">
                      <p className="font-semibold text-[#297525]">Availability</p>
                      <p>{vehicle.available ? 'Available now' : 'Unavailable'}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {vehicle.features.slice(0, 3).map((feature) => (
                      <span key={feature} className="rounded-full bg-[#76c573]/15 px-3 py-1 text-xs font-medium text-[#297525]">
                        {feature}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      onClick={() => navigate(`/vehicle/${vehicle.id}`)}
                      className="h-11 rounded-full bg-[#1fae19] px-6 text-sm font-semibold text-white transition hover:bg-green-700"
                    >
                      View Details
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

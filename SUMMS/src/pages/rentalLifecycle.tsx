import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import imgLogo from '../assets/logo.png';
import imgAdminLogo from '../assets/adminLogo.png';
import { rentalService } from "../services/rentalService";

type RentalState = {
  vehicleId: string;
  vehicleName: string;
  city: string;
  region: string;
  pricePerHour: number;
  provider: string;
  type: string;
  paymentMethod: string;
  total: number;
  status: 'reserved' | 'active' | 'completed';
  reservedAt: string;
};

const timelineSteps = [
  'Reserve Vehicle',
  'Pay Reservation',
  'Start Rental',
  'End Rental',
  'Return Vehicle',
];

export default function RentalLifecycle() {
  const navigate = useNavigate();
  const [rental, setRental] = useState<RentalState | null>(() =>
    rentalService.getCurrentRental()
  );

  const currentStepIndex = useMemo(() => {
    if (!rental) return 0;
    if (rental.status === 'reserved') return 2;
    if (rental.status === 'active') return 3;
    return 5;
  }, [rental]);



  if (!rental) {
    return (
      <div className="min-h-screen bg-[#f3f3f3] p-8">
        <div className="mx-auto max-w-2xl rounded-[30px] border-2 border-white/80 bg-white/80 p-8 text-center shadow-[0px_4px_30px_rgba(0,0,0,0.10)]">
          <h1 className="text-2xl font-semibold text-[#297525]">No rental in progress</h1>
          <p className="mt-3 text-sm text-gray-500">Start by searching and reserving a vehicle.</p>
          <button onClick={() => navigate('/vehicles')} className="mt-6 h-11 rounded-full bg-[#1fae19] px-6 text-sm font-semibold text-white">
            Go to Vehicle Search
          </button>
        </div>
      </div>
    );
  }

  const startRental = () => {
    setRental(rentalService.startRental());
  };

  const endRental = () => {
    setRental(rentalService.endRental());
  };

  const clearRental = () => {
    rentalService.clearRental();
    setRental(null);
    navigate('/vehicles');
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f3f3]">
      <header className="flex h-[72px] items-center justify-between bg-[#76c573] px-4 shadow-[0px_4px_25px_rgba(0,0,0,0.18)] sm:px-6">
        <button onClick={() => navigate('/vehicles')} className="flex items-center gap-2 text-white transition hover:text-[#165713]">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
          <span className="text-sm font-semibold">Back to Search</span>
        </button>
        <div className="flex items-center gap-3">
          <img src={imgAdminLogo} alt="Admin" className="h-9 w-9 object-contain sm:h-10 sm:w-10" />
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#165713] text-white sm:h-10 sm:w-10">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Zm0 2c-3.866 0-7 3.134-7 7 0 .552.448 1 1 1h12c.552 0 1-.448 1-1 0-3.866-3.134-7-7-7Z" /></svg>
          </div>
        </div>
      </header>

      <main className="relative px-4 py-8 sm:px-6 lg:px-8">
        <img src={imgLogo} alt="" className="pointer-events-none absolute left-1/2 top-[260px] w-[720px] max-w-[90vw] -translate-x-1/2 opacity-20" />

        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[1.1fr,0.9fr]">
          <section className="rounded-[32px] border-2 border-white/80 bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(234,234,234,0.49)_42.6%,rgba(245,245,245,0.96)_75.2%,rgba(255,255,255,0.41)_98.8%)] p-6 shadow-[0px_4px_35px_rgba(0,0,0,0.12)] backdrop-blur-[6px]">
            <p className="inline-flex rounded-full bg-[#165713] px-4 py-1 text-xs font-semibold tracking-wide text-white">Step 4 · Rental Lifecycle</p>
            <h1 className="mt-4 text-3xl font-semibold text-[#297525]">Manage your rental from pickup to return</h1>
            <p className="mt-2 text-sm text-gray-500">This screen follows the rental lifecycle in the diagrams: reservation confirmed, payment approved, pickup/start rental, active use, and final return.</p>

            <div className="mt-6 grid gap-4 md:grid-cols-5">
              {timelineSteps.map((step, index) => {
                const isComplete = index < currentStepIndex;
                const isCurrent = index === currentStepIndex;
                return (
                  <div key={step} className={`rounded-[24px] border-2 p-4 text-center text-sm ${isCurrent ? 'border-[#76c573] bg-[#76c573]/15' : isComplete ? 'border-[#41a7ff]/30 bg-[#41a7ff]/10' : 'border-white/80 bg-white/65'}`}>
                    <div className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${isCurrent ? 'bg-[#1fae19] text-white' : isComplete ? 'bg-[#41a7ff] text-white' : 'bg-gray-200 text-gray-500'}`}>
                      {index + 1}
                    </div>
                    <p className="font-medium text-[#297525]">{step}</p>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-[28px] bg-white/75 p-5 text-sm text-gray-600">
              <p className="font-semibold text-[#297525]">Current rental status</p>
              <p className="mt-1 text-lg font-semibold text-[#165713] capitalize">{rental.status}</p>
              <p className="mt-3">Provider confirms the rental record and the user can continue through the next lifecycle action.</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {rental.status === 'reserved' && (
                <button onClick={startRental} className="h-12 rounded-full bg-[#1fae19] px-6 text-sm font-semibold text-white transition hover:bg-green-700">
                  Start Rental
                </button>
              )}
              {rental.status === 'active' && (
                <button onClick={endRental} className="h-12 rounded-full bg-[#41a7ff] px-6 text-sm font-semibold text-white transition hover:bg-blue-600">
                  End Rental
                </button>
              )}
              {rental.status === 'completed' && (
                <button onClick={clearRental} className="h-12 rounded-full bg-[#1fae19] px-6 text-sm font-semibold text-white transition hover:bg-green-700">
                  Return Vehicle and Finish
                </button>
              )}
            </div>
          </section>

          <aside className="rounded-[32px] border-2 border-white/80 bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(245,245,245,0.96)_75.2%)] p-6 shadow-[0px_4px_35px_rgba(0,0,0,0.12)] backdrop-blur-[6px]">
            <h2 className="text-xl font-semibold text-[#297525]">Rental Details</h2>
            <div className="mt-5 space-y-4 text-sm text-gray-600">
              <div className="rounded-2xl bg-white/75 p-4"><p className="font-semibold text-[#297525]">Vehicle</p><p>{rental.vehicleName}</p></div>
              <div className="rounded-2xl bg-white/75 p-4"><p className="font-semibold text-[#297525]">Provider</p><p>{rental.provider}</p></div>
              <div className="rounded-2xl bg-white/75 p-4"><p className="font-semibold text-[#297525]">Pickup Zone</p><p>{rental.city}, {rental.region}</p></div>
              <div className="rounded-2xl bg-white/75 p-4"><p className="font-semibold text-[#297525]">Payment</p><p>{rental.paymentMethod}</p></div>
              <div className="rounded-2xl bg-white/75 p-4"><p className="font-semibold text-[#297525]">Receipt</p><p className="text-2xl font-semibold text-[#165713]">${rental.total}</p></div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

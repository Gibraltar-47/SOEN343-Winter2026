import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import imgLogo from '../assets/logo.png';
import imgAdminLogo from '../assets/adminLogo.png';
import { paymentService } from "../services/paymentService";

type ReservationState = {
  vehicleId: string;
  vehicleName: string;
  city: string;
  region: string;
  pricePerHour: number;
  provider: string;
  type: string;
};

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const reservation = location.state as ReservationState | undefined;
  const [paymentMethod, setPaymentMethod] = useState('Wallet');

  const total = useMemo(() => (reservation ? reservation.pricePerHour * 3 : 0), [reservation]);

  if (!reservation) {
    return (
      <div className="min-h-screen bg-[#f3f3f3] p-8">
        <div className="mx-auto max-w-2xl rounded-[30px] border-2 border-white/80 bg-white/80 p-8 text-center shadow-[0px_4px_30px_rgba(0,0,0,0.10)]">
          <h1 className="text-2xl font-semibold text-[#297525]">No reservation selected</h1>
          <p className="mt-3 text-sm text-gray-500">Choose a vehicle first before proceeding to payment.</p>
          <button onClick={() => navigate('/vehicles')} className="mt-6 h-11 rounded-full bg-[#1fae19] px-6 text-sm font-semibold text-white">
            Go to Vehicle Search
          </button>
        </div>
      </div>
    );
  }

  const handleConfirmPayment = () => {
    paymentService.processReservationPayment(
      reservation,
      paymentMethod,
      3
    );

    navigate('/rental-lifecycle');
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f3f3]">
      <header className="flex h-[72px] items-center justify-between bg-[#76c573] px-4 shadow-[0px_4px_25px_rgba(0,0,0,0.18)] sm:px-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-white transition hover:text-[#165713]">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" /></svg>
          <span className="text-sm font-semibold">Back</span>
        </button>
        <div className="flex items-center gap-3">
          <img src={imgAdminLogo} alt="Admin" className="h-9 w-9 object-contain sm:h-10 sm:w-10" />
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#165713] text-white sm:h-10 sm:w-10">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor"><path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Zm0 2c-3.866 0-7 3.134-7 7 0 .552.448 1 1 1h12c.552 0 1-.448 1-1 0-3.866-3.134-7-7-7Z" /></svg>
          </div>
        </div>
      </header>

      <main className="relative px-4 py-8 sm:px-6 lg:px-8">
        <img src={imgLogo} alt="" className="pointer-events-none absolute left-1/2 top-[240px] w-[720px] max-w-[90vw] -translate-x-1/2 opacity-20" />

        <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[1fr,0.9fr]">
          <section className="rounded-[32px] border-2 border-white/80 bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(234,234,234,0.49)_42.6%,rgba(245,245,245,0.96)_75.2%,rgba(255,255,255,0.41)_98.8%)] p-6 shadow-[0px_4px_35px_rgba(0,0,0,0.12)] backdrop-blur-[6px]">
            <p className="inline-flex rounded-full bg-[#165713] px-4 py-1 text-xs font-semibold tracking-wide text-white">Step 3 · Pay Reservation</p>
            <h1 className="mt-4 text-3xl font-semibold text-[#297525]">Confirm your reservation</h1>
            <p className="mt-2 text-sm text-gray-500">The system now requests payment authorization before the rental can be activated.</p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {['Wallet', 'Credit Card', 'Debit Card'].map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`rounded-[24px] border-2 p-5 text-left transition ${paymentMethod === method ? 'border-[#76c573] bg-[#76c573]/15 shadow-[0px_4px_20px_rgba(0,0,0,0.10)]' : 'border-white/80 bg-white/70'}`}
                >
                  <p className="font-semibold text-[#297525]">{method}</p>
                  <p className="mt-1 text-sm text-gray-500">Mock payment method for the prototype flow.</p>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-[28px] bg-white/75 p-5 text-sm text-gray-600">
              <p className="font-semibold text-[#297525]">Authorization notes</p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>Reservation is held once payment is approved.</li>
                <li>User receives a confirmation receipt.</li>
                <li>Pickup can begin from the rental lifecycle page.</li>
              </ul>
            </div>
          </section>

          <aside className="rounded-[32px] border-2 border-white/80 bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(245,245,245,0.96)_75.2%)] p-6 shadow-[0px_4px_35px_rgba(0,0,0,0.12)] backdrop-blur-[6px]">
            <h2 className="text-xl font-semibold text-[#297525]">Payment Summary</h2>
            <div className="mt-5 space-y-4 text-sm text-gray-600">
              <div className="rounded-2xl bg-white/75 p-4">
                <p className="font-semibold text-[#297525]">Vehicle</p>
                <p>{reservation.vehicleName}</p>
              </div>
              <div className="rounded-2xl bg-white/75 p-4">
                <p className="font-semibold text-[#297525]">Pickup zone</p>
                <p>{reservation.city}, {reservation.region}</p>
              </div>
              <div className="rounded-2xl bg-white/75 p-4">
                <p className="font-semibold text-[#297525]">Estimated total</p>
                <p className="text-2xl font-semibold text-[#165713]">${total}</p>
                <p className="text-xs text-gray-400">Based on a 3-hour reservation</p>
              </div>
              <div className="rounded-2xl bg-white/75 p-4">
                <p className="font-semibold text-[#297525]">Selected payment</p>
                <p>{paymentMethod}</p>
              </div>
            </div>

            <button onClick={handleConfirmPayment} className="mt-6 h-12 w-full rounded-full bg-[#1fae19] px-6 text-sm font-semibold text-white transition hover:bg-green-700">
              Confirm and Reserve
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}

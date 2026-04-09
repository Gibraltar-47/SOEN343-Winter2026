import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import imgLogo from '../assets/logo.png';
import { paymentService } from "../services/paymentService";
import { sessionService } from "../services/sessionService";
import {
  safetyModeService,
  type TrustedContact,
} from "../services/safetyModeService";
import AppHeader from '../component/AppHeader';

type ReservationState = {
  vehicleId: string;
  vehicleName: string;
  city: string;
  region: string;
  pricePerHour: number;
  providerId: string,
  providerName: string;
  type: string;
};

type ContactForm = {
  fullName: string;
  email: string;
  phoneNumber: string;
};

const emptyContact = (): ContactForm => ({
  fullName: "",
  email: "",
  phoneNumber: "",
});

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const reservation = location.state as ReservationState | undefined;
  const [paymentMethod, setPaymentMethod] = useState('Wallet');
  const [safetyModeEnabled, setSafetyModeEnabled] = useState(false);
  const [expectedReturnAt, setExpectedReturnAt] = useState("");
  const [contacts, setContacts] = useState<ContactForm[]>([
    emptyContact(),
    emptyContact(),
    emptyContact(),
  ]);

  const total = useMemo(
    () => (reservation ? reservation.pricePerHour * 3 : 0),
    [reservation]
  );

  if (!reservation) {
    return (
      <div className="min-h-screen bg-[#f3f3f3] p-8">
        <div className="mx-auto max-w-2xl rounded-[30px] border-2 border-white/80 bg-white/80 p-8 text-center shadow-[0px_4px_30px_rgba(0,0,0,0.10)]">
          <h1 className="text-2xl font-semibold text-[#297525]">
            No reservation selected
          </h1>
          <p className="mt-3 text-sm text-gray-500">
            Choose a vehicle first before proceeding to payment.
          </p>
          <button
            onClick={() => navigate('/vehicles')}
            className="mt-6 h-11 rounded-full bg-[#1fae19] px-6 text-sm font-semibold text-white"
          >
            Go to Vehicle Search
          </button>
        </div>
      </div>
    );
  }

  const updateContact = (
    index: number,
    field: keyof ContactForm,
    value: string,
  ) => {
    setContacts((prev) =>
      prev.map((contact, i) =>
        i === index ? { ...contact, [field]: value } : contact
      )
    );
  };

  const parseTrustedContacts = (): TrustedContact[] => {
    return contacts
      .map((contact, index) => ({
        id: `contact-${index + 1}`,
        fullName: contact.fullName.trim(),
        email: contact.email.trim(),
        phoneNumber: contact.phoneNumber.trim(),
      }))
      .filter(
        (contact) =>
          contact.fullName || contact.email || contact.phoneNumber
      );
  };

  const validTrustedContacts = (): TrustedContact[] => {
    return parseTrustedContacts().filter(
      (contact) =>
        contact.fullName &&
        contact.email &&
        contact.phoneNumber
    );
  };

  const handleConfirmPayment = () => {
    const currentUser = sessionService.getCurrentUser();

    if (!currentUser) {
      alert("You must be logged in to complete a reservation.");
      navigate("/");
      return;
    }

    if (safetyModeEnabled) {
      const parsed = parseTrustedContacts();
      const valid = validTrustedContacts();

      if (parsed.length === 0) {
        alert("Please add at least one trusted contact for Safety Mode.");
        return;
      }

      if (valid.length !== parsed.length) {
        alert("Each trusted contact must include a name, email address, and phone number.");
        return;
      }

      if (valid.length > 3) {
        alert("You can add up to 3 trusted contacts.");
        return;
      }
    }

    paymentService.processReservationPayment(
      reservation,
      paymentMethod,
      currentUser.id,
      `${currentUser.firstName} ${currentUser.lastName}`,
      3
    );

    const trustedContacts = validTrustedContacts();

    const storedRentals = JSON.parse(localStorage.getItem("rentals") || "[]");

    const latestRental = [...storedRentals]
      .filter((rental) => rental.userId === currentUser.id)
      .sort(
        (a, b) =>
          new Date(b.reservedAt).getTime() - new Date(a.reservedAt).getTime()
      )[0];

    const rentalId = latestRental?.id;

    if (!rentalId) {
      alert("Could not find the created rental for Safety Mode.");
      navigate("/my-rentals");
      return;
    }

    safetyModeService.setupSafetyMode({
      rentalId,
      userId: currentUser.id,
      userName: `${currentUser.firstName} ${currentUser.lastName}`,
      vehicleName: reservation.vehicleName,
      providerName: reservation.providerName,
      city: reservation.city,
      region: reservation.region,
      trustedContacts,
      enabled: safetyModeEnabled,
      expectedReturnAt: expectedReturnAt || undefined,
    });

    navigate('/my-rentals');
  };

  return (
    <div className="min-h-screen w-full bg-[#f3f3f3]">
      <AppHeader />

      <main className="px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#165713] transition hover:text-[#0f3f0d]"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
            </svg>
            Back
          </button>
        </div>

        <img
          src={imgLogo}
          alt=""
          className="pointer-events-none absolute left-1/2 top-[240px] w-[720px] max-w-[90vw] -translate-x-1/2 opacity-20"
        />

        <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-[1fr,0.9fr]">
          <section className="rounded-[32px] border-2 border-white/80 bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(234,234,234,0.49)_42.6%,rgba(245,245,245,0.96)_75.2%,rgba(255,255,255,0.41)_98.8%)] p-6 shadow-[0px_4px_35px_rgba(0,0,0,0.12)] backdrop-blur-[6px]">
            <p className="inline-flex rounded-full bg-[#165713] px-4 py-1 text-xs font-semibold tracking-wide text-white">
              Step 3 · Pay Reservation
            </p>
            <h1 className="mt-4 text-3xl font-semibold text-[#297525]">
              Confirm your reservation
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              The system now requests payment authorization before the rental can be activated.
            </p>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {['Wallet', 'Credit Card', 'Debit Card'].map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`rounded-[24px] border-2 p-5 text-left transition ${
                    paymentMethod === method
                      ? 'border-[#76c573] bg-[#76c573]/15 shadow-[0px_4px_20px_rgba(0,0,0,0.10)]'
                      : 'border-white/80 bg-white/70'
                  }`}
                >
                  <p className="font-semibold text-[#297525]">{method}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Mock payment method for the prototype flow.
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-[28px] bg-white/75 p-5 text-sm text-gray-600">
              <p className="font-semibold text-[#297525]">Authorization notes</p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                <li>Reservation is held once payment is approved.</li>
                <li>Live sharing only starts after the rental begins.</li>
                <li>Trusted contacts will receive simulated safety notifications.</li>
              </ul>
            </div>

            <div className="mt-6 rounded-[28px] bg-white/75 p-5 text-sm text-gray-600">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-[#297525]">Safety Mode</p>
                  <p className="mt-1 text-sm text-gray-500">
                    Add up to 3 trusted contacts. Sharing becomes live only after the rental starts.
                  </p>
                </div>

                <label className="flex items-center gap-2 text-sm font-medium text-[#297525]">
                  <input
                    type="checkbox"
                    checked={safetyModeEnabled}
                    onChange={(e) => setSafetyModeEnabled(e.target.checked)}
                    className="h-5 w-5 accent-[#1fae19]"
                  />
                  Enable
                </label>
              </div>

              {safetyModeEnabled && (
                <div className="mt-4 space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#297525]">
                      Expected return time
                    </label>
                    <input
                      type="datetime-local"
                      value={expectedReturnAt}
                      onChange={(e) => setExpectedReturnAt(e.target.value)}
                      className="w-full rounded-xl border p-3 text-sm"
                    />
                  </div>

                  {contacts.map((contact, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-gray-200 bg-white/80 p-4"
                    >
                      <p className="mb-3 font-semibold text-[#297525]">
                        Trusted Contact {index + 1}
                      </p>

                      <div className="grid gap-3 md:grid-cols-3">
                        <input
                          type="text"
                          value={contact.fullName}
                          onChange={(e) =>
                            updateContact(index, "fullName", e.target.value)
                          }
                          placeholder="Full name"
                          className="rounded-xl border p-3 text-sm"
                        />

                        <input
                          type="email"
                          value={contact.email}
                          onChange={(e) =>
                            updateContact(index, "email", e.target.value)
                          }
                          placeholder="Email address"
                          className="rounded-xl border p-3 text-sm"
                        />

                        <input
                          type="tel"
                          value={contact.phoneNumber}
                          onChange={(e) =>
                            updateContact(index, "phoneNumber", e.target.value)
                          }
                          placeholder="Phone number"
                          className="rounded-xl border p-3 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              <div className="rounded-2xl bg-white/75 p-4">
                <p className="font-semibold text-[#297525]">Safety Mode</p>
                <p>{safetyModeEnabled ? "Enabled" : "Disabled"}</p>
                {safetyModeEnabled && (
                  <p className="text-xs text-gray-400">
                    {validTrustedContacts().length} complete contact(s)
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={handleConfirmPayment}
              className="mt-6 h-12 w-full rounded-full bg-[#1fae19] px-6 text-sm font-semibold text-white transition hover:bg-green-700"
            >
              Confirm and Reserve
            </button>
          </aside>
        </div>
      </main>
    </div>
  );
}
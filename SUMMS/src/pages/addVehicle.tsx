import { useState } from "react";
import { useNavigate } from "react-router-dom";
import imgLogo from "../assets/logo.png";
import imgAdminLogo from "../assets/adminLogo.png";

const API_BASE_URL = "http://127.0.0.1:8000";

const inputClassName =
  "h-12 w-full rounded-full border-2 border-white/80 bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(245,245,245,0.96)_75.2%)] px-5 text-sm text-gray-700 shadow-[0px_4px_16px_rgba(0,0,0,0.08)] outline-none placeholder:text-gray-400 focus:border-[#76c573]";

export default function AddVehicle() {
  const navigate = useNavigate();
  const providerId = localStorage.getItem("providerId");

  const [form, setForm] = useState({
    type: "",
    model: "",
    status: "available",
    price_per_hour: "",
    location_id: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!providerId) {
      setMessage("No provider is currently logged in.");
      return;
    }

    try {
      setIsSubmitting(true);
      setMessage("");

      const response = await fetch(`${API_BASE_URL}/vehicles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider_id: Number(providerId),
          type: form.type,
          model: form.model,
          status: form.status,
          price_per_hour: Number(form.price_per_hour),
          location_id: Number(form.location_id),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to add vehicle.");
      }

      setMessage("Vehicle added successfully.");
      setForm({
        type: "",
        model: "",
        status: "available",
        price_per_hour: "",
        location_id: "",
      });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  }

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
            <img src={imgAdminLogo} alt="Provider" className="h-9 w-9 object-contain sm:h-10 sm:w-10" />
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

            <div className="relative z-10 flex w-full max-w-2xl flex-col items-center">
                <div className="w-full rounded-[32px] border-2 border-white/80 bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(234,234,234,0.49)_42.6%,rgba(245,245,245,0.96)_75.2%,rgba(255,255,255,0.41)_98.8%)] px-6 py-8 shadow-[0px_4px_28px_rgba(0,0,0,0.10)] backdrop-blur-[6px] sm:px-8">
                <div className="flex flex-col items-center gap-3">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#76c573] text-white shadow-lg">
                    <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
                        <path d="M19 15.18V7c0-2.21-1.79-4-4-4h-1V1h-4v2H9C6.79 3 5 4.79 5 7v8.18C3.84 15.6 3 16.71 3 18v3h2v1h2v-1h10v1h2v-1h2v-3c0-1.29-.84-2.4-2-2.82zM16 13H8V7h8v6z" />
                    </svg>
                    </div>

                    <h1 className="text-center text-[32px] font-medium text-[#297525]">
                    Add Vehicle
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 flex w-full flex-col gap-4">
                    <select
                    className={inputClassName}
                    value={form.type}
                    onChange={(e) => updateField("type", e.target.value)}
                    >
                    <option value="">Select vehicle type</option>
                    <option value="car">Car</option>
                    <option value="bike">Bike</option>
                    <option value="scooter">Scooter</option>
                    </select>

                    <input
                    className={inputClassName}
                    type="text"
                    placeholder="Vehicle model"
                    value={form.model}
                    onChange={(e) => updateField("model", e.target.value)}
                    />

                    <select
                    className={inputClassName}
                    value={form.status}
                    onChange={(e) => updateField("status", e.target.value)}
                    >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                    </select>

                    <input
                    className={inputClassName}
                    type="number"
                    placeholder="Price per hour"
                    value={form.price_per_hour}
                    onChange={(e) => updateField("price_per_hour", e.target.value)}
                    />

                    <input
                    className={inputClassName}
                    type="number"
                    placeholder="Location ID"
                    value={form.location_id}
                    onChange={(e) => updateField("location_id", e.target.value)}
                    />

                    {message ? (
                    <div className="rounded-full bg-white/80 px-5 py-3 text-center text-sm text-[#297525] shadow-[0px_4px_16px_rgba(0,0,0,0.08)]">
                        {message}
                    </div>
                    ) : null}

                    <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-2 rounded-full bg-[#165713] px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#11440f] disabled:opacity-70"
                    >
                    {isSubmitting ? "Adding..." : "Add Vehicle"}
                    </button>
                </form>
                </div>
            </div>
            </main>
      </div>
    </div>
  );
}
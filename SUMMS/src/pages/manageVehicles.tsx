import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import imgLogo from "../assets/logo.png";
import imgAdminLogo from "../assets/adminLogo.png";

const API_BASE_URL = "http://127.0.0.1:8000";

type Vehicle = {
  id: number;
  provider_id: number;
  type: string;
  model: string;
  status: "available" | "unavailable";
  price_per_hour: number;
  location_id: number;
  created_at: string;
};

const inputClassName =
  "h-11 w-full rounded-full border-2 border-white/80 bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(245,245,245,0.96)_75.2%)] px-5 text-sm text-gray-700 shadow-[0px_4px_16px_rgba(0,0,0,0.08)] outline-none focus:border-[#76c573]";

export default function ManageVehicles() {
  const navigate = useNavigate();
  const providerId = localStorage.getItem("providerId");

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [editForm, setEditForm] = useState({
    type: "",
    model: "",
    status: "available",
    price_per_hour: "",
    location_id: "",
  });

  async function fetchVehicles() {
    if (!providerId) {
      setMessage("No provider is currently logged in.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/providers/${providerId}/vehicles`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to load vehicles.");
      }

      setVehicles(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVehicles();
  }, []);

  function openEditModal(vehicle: Vehicle) {
    setSelectedVehicle(vehicle);
    setEditForm({
      type: vehicle.type,
      model: vehicle.model,
      status: vehicle.status,
      price_per_hour: String(vehicle.price_per_hour),
      location_id: String(vehicle.location_id),
    });
  }

  function closeEditModal() {
    setSelectedVehicle(null);
  }

  async function handleDelete(vehicleId: number) {
    if (!providerId) return;

    try {
      const response = await fetch(`${API_BASE_URL}/providers/${providerId}/vehicles/${vehicleId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to delete vehicle.");
      }

      setVehicles((prev) => prev.filter((vehicle) => vehicle.id !== vehicleId));
      setMessage("Vehicle deleted successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
    }
  }

  async function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!providerId || !selectedVehicle) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/providers/${providerId}/vehicles/${selectedVehicle.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: editForm.type,
            model: editForm.model,
            status: editForm.status,
            price_per_hour: Number(editForm.price_per_hour),
            location_id: Number(editForm.location_id),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to update vehicle.");
      }

      setVehicles((prev) =>
        prev.map((vehicle) => (vehicle.id === selectedVehicle.id ? data : vehicle))
      );
      setMessage("Vehicle updated successfully.");
      closeEditModal();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Something went wrong.");
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

            <div className="relative z-10 flex w-full max-w-4xl flex-col items-center">
                <div className="w-full rounded-[32px] border-2 border-white/80 bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(234,234,234,0.49)_42.6%,rgba(245,245,245,0.96)_75.2%,rgba(255,255,255,0.41)_98.8%)] px-6 py-8 shadow-[0px_4px_28px_rgba(0,0,0,0.10)] backdrop-blur-[6px] sm:px-8">
                <div className="flex flex-col items-center gap-3">
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#76c573] text-white shadow-lg">
                    <svg viewBox="0 0 24 24" className="h-10 w-10" fill="currentColor">
                        <path d="M19 15.18V7c0-2.21-1.79-4-4-4h-1V1h-4v2H9C6.79 3 5 4.79 5 7v8.18C3.84 15.6 3 16.71 3 18v3h2v1h2v-1h10v1h2v-1h2v-3c0-1.29-.84-2.4-2-2.82zM16 13H8V7h8v6z" />
                    </svg>
                    </div>

                    <h1 className="text-center text-[32px] font-medium text-[#297525]">
                    Manage Vehicles
                    </h1>

                    <button
                    onClick={() => navigate("/provider/add-vehicle")}
                    className="mt-2 rounded-full bg-[#165713] px-6 py-3 text-sm font-semibold text-white shadow transition hover:bg-[#11440f]"
                    >
                    Add Vehicle
                    </button>
                </div>

                {message ? (
                    <div className="mt-6 w-full rounded-full bg-white/80 px-5 py-3 text-center text-sm text-[#297525] shadow-[0px_4px_16px_rgba(0,0,0,0.08)]">
                    {message}
                    </div>
                ) : null}

                <div className="mt-8">
                    {loading ? (
                    <div className="text-center text-sm text-gray-500">Loading vehicles...</div>
                    ) : vehicles.length === 0 ? (
                    <div className="mx-auto w-fit rounded-full bg-[#165713] px-6 py-2 text-sm font-semibold text-white tracking-wide shadow">
                        No vehicles found
                    </div>
                    ) : (
                    <div className="grid w-full grid-cols-1 gap-4">
                        {vehicles.map((vehicle) => (
                        <div
                            key={vehicle.id}
                            className="flex items-center justify-between gap-4 rounded-full border-2 border-white/80 bg-white/70 px-6 py-4 shadow-[0px_4px_16px_rgba(0,0,0,0.08)]"
                        >
                            <div>
                            <p className="text-sm font-semibold text-[#297525]">{vehicle.model}</p>
                            <p className="text-xs text-gray-400">
                                {vehicle.type} · ${vehicle.price_per_hour}/h · location {vehicle.location_id}
                            </p>
                            </div>

                            <div className="flex items-center gap-2">
                            <button
                                onClick={() => openEditModal(vehicle)}
                                className="rounded-full bg-[#41a7ff] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => handleDelete(vehicle.id)}
                                className="rounded-full bg-[#d4183d] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                            >
                                Delete
                            </button>
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

      {selectedVehicle ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
          <div className="w-full max-w-lg rounded-[28px] border-2 border-white/80 bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(234,234,234,0.49)_42.6%,rgba(245,245,245,0.96)_75.2%,rgba(255,255,255,0.41)_98.8%)] p-7 shadow-[0px_10px_40px_rgba(0,0,0,0.22)] backdrop-blur-[6px]">
            <h2 className="mb-5 text-2xl font-semibold text-[#297525]">Edit Vehicle</h2>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <select className={inputClassName} value={editForm.type} onChange={(e) => setEditForm((p) => ({ ...p, type: e.target.value }))}>
                <option value="car">Car</option>
                <option value="bike">Bike</option>
                <option value="scooter">Scooter</option>
              </select>

              <input
                className={inputClassName}
                type="text"
                value={editForm.model}
                onChange={(e) => setEditForm((p) => ({ ...p, model: e.target.value }))}
              />

              <select className={inputClassName} value={editForm.status} onChange={(e) => setEditForm((p) => ({ ...p, status: e.target.value }))}>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>

              <input
                className={inputClassName}
                type="number"
                value={editForm.price_per_hour}
                onChange={(e) => setEditForm((p) => ({ ...p, price_per_hour: e.target.value }))}
              />

              <input
                className={inputClassName}
                type="number"
                value={editForm.location_id}
                onChange={(e) => setEditForm((p) => ({ ...p, location_id: e.target.value }))}
              />

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-full bg-[#165713] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#11440f]"
                >
                  Save
                </button>

                <button
                  type="button"
                  onClick={closeEditModal}
                  className="rounded-full bg-[#41a7ff] px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
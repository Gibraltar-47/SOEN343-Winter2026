import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import imgLogo from "../assets/logo.png";
import imgAdminLogo from "../assets/adminLogo.png";
import type { Vehicle, VehicleType } from "../types/vehicle";
import { sessionService } from "../services/sessionService";
import {
  deleteProviderVehicle,
  getProviderVehicles,
  updateProviderVehicle,
} from "../services/providerVehicleService";

const inputClassName =
  "h-11 w-full rounded-full border-2 border-white/80 bg-[linear-gradient(147deg,rgba(223,223,223,0.69)_2.7%,rgba(245,245,245,0.96)_75.2%)] px-5 text-sm text-gray-700 shadow-[0px_4px_16px_rgba(0,0,0,0.08)] outline-none focus:border-[#76c573]";

export default function ManageVehicles() {
  const navigate = useNavigate();
  const currentUser = sessionService.getCurrentUser();
  const providerId = currentUser?.id;

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [editForm, setEditForm] = useState({
    type: "Car",
    name: "",
    city: "",
    region: "",
    pricePerHour: "",
    seats: "",
    rangeKm: "",
    transmission: "",
    fuel: "",
    description: "",
    available: "true",
  });

  useEffect(() => {
    setVehicles(getProviderVehicles(providerId));
    setLoading(false);
  }, [providerId]);

  function openEditModal(vehicle: Vehicle) {
    setSelectedVehicle(vehicle);
    setEditForm({
      type: vehicle.type,
      name: vehicle.name,
      city: vehicle.city,
      region: vehicle.region,
      pricePerHour: String(vehicle.pricePerHour),
      seats: vehicle.seats ? String(vehicle.seats) : "",
      rangeKm: String(vehicle.rangeKm),
      transmission: vehicle.transmission || "",
      fuel: vehicle.fuel || "",
      description: vehicle.description || "",
      available: String(vehicle.available),
    });
  }

  function closeEditModal() {
    setSelectedVehicle(null);
  }

  function refreshVehicles() {
    setVehicles(getProviderVehicles(providerId));
  }

  function handleDelete(vehicleId: string) {
    const deleted = deleteProviderVehicle(vehicleId);

    if (deleted) {
      refreshVehicles();
      setMessage("Vehicle deleted successfully.");
    } else {
      setMessage("Vehicle could not be deleted.");
    }
  }

  function handleSaveEdit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedVehicle) return;

    const updated = updateProviderVehicle(selectedVehicle.id, {
      name: editForm.name,
      type: editForm.type as VehicleType,
      city: editForm.city,
      region: editForm.region,
      pricePerHour: Number(editForm.pricePerHour),
      seats: editForm.seats ? Number(editForm.seats) : undefined,
      rangeKm: Number(editForm.rangeKm),
      transmission: editForm.transmission || undefined,
      fuel: editForm.fuel || undefined,
      description: editForm.description,
      available: editForm.available === "true",
    });

    if (updated) {
      refreshVehicles();
      setMessage("Vehicle updated successfully.");
      closeEditModal();
    } else {
      setMessage("Vehicle could not be updated.");
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
                  <div className="mx-auto w-fit rounded-full bg-[#165713] px-6 py-2 text-sm font-semibold tracking-wide text-white shadow">
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
                          <p className="text-sm font-semibold text-[#297525]">
                            {vehicle.image} {vehicle.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {vehicle.type} · ${vehicle.pricePerHour}/h · {vehicle.city},{" "}
                            {vehicle.region}
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
              <select
                className={inputClassName}
                value={editForm.type}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, type: e.target.value }))
                }
              >
                <option value="Car">Car</option>
                <option value="Bike">Bike</option>
                <option value="Scooter">Scooter</option>
                <option value="Van">Van</option>
              </select>

              <input
                className={inputClassName}
                type="text"
                placeholder="Vehicle name / model"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, name: e.target.value }))
                }
              />

              <input
                className={inputClassName}
                type="text"
                placeholder="City"
                value={editForm.city}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, city: e.target.value }))
                }
              />

              <input
                className={inputClassName}
                type="text"
                placeholder="Region"
                value={editForm.region}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, region: e.target.value }))
                }
              />

              <input
                className={inputClassName}
                type="number"
                placeholder="Price per hour"
                value={editForm.pricePerHour}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, pricePerHour: e.target.value }))
                }
              />

              <input
                className={inputClassName}
                type="number"
                placeholder="Seats"
                value={editForm.seats}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, seats: e.target.value }))
                }
              />

              <input
                className={inputClassName}
                type="number"
                placeholder="Range in km"
                value={editForm.rangeKm}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, rangeKm: e.target.value }))
                }
              />

              <input
                className={inputClassName}
                type="text"
                placeholder="Transmission"
                value={editForm.transmission}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, transmission: e.target.value }))
                }
              />

              <input
                className={inputClassName}
                type="text"
                placeholder="Fuel / power source"
                value={editForm.fuel}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, fuel: e.target.value }))
                }
              />

              <input
                className={inputClassName}
                type="text"
                placeholder="Short description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, description: e.target.value }))
                }
              />

              <select
                className={inputClassName}
                value={editForm.available}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, available: e.target.value }))
                }
              >
                <option value="true">Available</option>
                <option value="false">Unavailable</option>
              </select>

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
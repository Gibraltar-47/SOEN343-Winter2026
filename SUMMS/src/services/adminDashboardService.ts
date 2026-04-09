import { getClients } from "./userService";
import { getAnalytics } from "./analyticsService";
import { parkingLots, type ParkingReservation } from "../data/parking";

type RentalStatus = "reserved" | "active" | "completed" | "cancelled";

type StoredRental = {
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
const PARKING_RESERVATIONS_KEY = "parkingReservations";

function getStoredRentals(): StoredRental[] {
  return JSON.parse(localStorage.getItem(RENTALS_KEY) || "[]");
}

function getStoredParkingReservations(): ParkingReservation[] {
  return JSON.parse(localStorage.getItem(PARKING_RESERVATIONS_KEY) || "[]");
}

function normalizeCityFromLotArea(area: string): string {
  return area === "Laval" ? "Laval" : "Montreal";
}

export function getAdminDashboardSummary() {
  const analytics = getAnalytics() || {
    activeRentals: 0,
    completedRentals: 0,
    paymentAttempts: 0,
    successfulPayments: 0,
  };

  const rentals = getStoredRentals();
  const parkingReservations = getStoredParkingReservations();
  const clients = getClients();

  const activeRentalsByCityMap = new Map<string, number>();
  rentals
    .filter((rental) => rental.status === "active")
    .forEach((rental) => {
      const city = rental.city || "Unknown";
      activeRentalsByCityMap.set(
        city,
        (activeRentalsByCityMap.get(city) || 0) + 1
      );
    });

  const activeRentalsByCity = Array.from(activeRentalsByCityMap.entries())
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count);

  const totalSpotsByCity = new Map<string, number>();
  parkingLots.forEach((lot) => {
    const city = normalizeCityFromLotArea(lot.area);
    totalSpotsByCity.set(city, (totalSpotsByCity.get(city) || 0) + lot.totalSpots);
  });

  const reservedByCity = new Map<string, number>();
  parkingReservations.forEach((reservation) => {
    const city = reservation.city || "Unknown";
    reservedByCity.set(city, (reservedByCity.get(city) || 0) + 1);
  });

  const parkingUtilizationByCity = Array.from(totalSpotsByCity.entries()).map(
    ([city, totalSpots]) => {
      const reservedSpots = reservedByCity.get(city) || 0;
      const utilizationPercent =
        totalSpots > 0 ? Number(((reservedSpots / totalSpots) * 100).toFixed(1)) : 0;

      return {
        city,
        totalSpots,
        reservedSpots,
        utilizationPercent,
      };
    }
  );

  const bikes = rentals.filter((rental) =>
    rental.type?.toLowerCase().includes("bike")
  ).length;

  const scooters = rentals.filter((rental) =>
    rental.type?.toLowerCase().includes("scooter")
  ).length;

  return {
    totalRegisteredUsers: clients.length,
    activeRentalsByCity,
    parkingUtilizationByCity,
    numberOfCompletedTrips: rentals.filter(
      (rental) => rental.status === "completed"
    ).length,
    bikesVsScooters: {
      bikes,
      scooters,
    },

    activeRentals: analytics.activeRentals,
    completedRentals: analytics.completedRentals,
    paymentAttempts: analytics.paymentAttempts,
    successfulPayments: analytics.successfulPayments,
  };
}
import type { ParkingReservation } from "../data/parking";

const PARKING_RESERVATIONS_KEY = "parkingReservations";

export function getParkingReservations(): ParkingReservation[] {
  try {
    return JSON.parse(localStorage.getItem(PARKING_RESERVATIONS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveParkingReservations(reservations: ParkingReservation[]) {
  localStorage.setItem(
    PARKING_RESERVATIONS_KEY,
    JSON.stringify(reservations)
  );
}

export function addParkingReservation(reservation: ParkingReservation) {
  const existing = getParkingReservations();
  existing.unshift(reservation);
  saveParkingReservations(existing);
}

export function removeParkingReservation(reservationId: string) {
  const existing = getParkingReservations();
  const updated = existing.filter((r) => r.id !== reservationId);
  saveParkingReservations(updated);
}
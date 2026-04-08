import { Observer, Subject } from "../patterns/observer";
import { ActiveState, ReservedState } from "../patterns/rentalState";
import { rentalAnalyticsObserver } from "./analyticsService";

export type RentalStatus = "reserved" | "active" | "completed";

export type RentalRecord = {
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
  provider: string;
  type: string;
  paymentMethod: string;
  total: number;
  status: RentalStatus;
  reservedAt: string;
};

const RENTAL_KEY = "currentRental";

class RentalService implements Subject {
  private observers: Observer[] = [rentalAnalyticsObserver];

  attach(observer: Observer): void {
    this.observers.push(observer);
  }

  detach(observer: Observer): void {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  notify(event: string, payload?: any): void {
    this.observers.forEach((observer) => observer.update(event, payload));
  }

  getCurrentRental(): RentalRecord | null {
    const saved = localStorage.getItem(RENTAL_KEY);
    return saved ? JSON.parse(saved) : null;
  }

  saveRental(rental: RentalRecord | null) {
    if (rental) {
      localStorage.setItem(RENTAL_KEY, JSON.stringify(rental));
    } else {
      localStorage.removeItem(RENTAL_KEY);
    }
  }

  startRental(): RentalRecord | null {
    const rental = this.getCurrentRental();
    if (!rental) return null;

    const state = new ReservedState();
    const nextStatus = state.start();

    const updated: RentalRecord = { ...rental, status: nextStatus };
    this.saveRental(updated);
    this.notify("rental_started");

    return updated;
  }

  endRental(): RentalRecord | null {
    const rental = this.getCurrentRental();
    if (!rental) return null;

    const state = new ActiveState();
    const nextStatus = state.end();

    const updated: RentalRecord = { ...rental, status: nextStatus };
    this.saveRental(updated);
    this.notify("rental_completed");

    return updated;
  }

  clearRental() {
    this.saveRental(null);
  }
}

export const rentalService = new RentalService();
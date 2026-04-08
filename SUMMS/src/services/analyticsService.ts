import { Observer } from "../patterns/observer";

export type AnalyticsState = {
  activeRentals: number;
  completedRentals: number;
  paymentAttempts: number;
  successfulPayments: number;
};

const ANALYTICS_KEY = "analytics";

const defaultAnalytics: AnalyticsState = {
  activeRentals: 0,
  completedRentals: 0,
  paymentAttempts: 0,
  successfulPayments: 0,
};

function loadAnalytics(): AnalyticsState {
  const saved = localStorage.getItem(ANALYTICS_KEY);
  return saved ? JSON.parse(saved) : { ...defaultAnalytics };
}

function saveAnalytics(state: AnalyticsState) {
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(state));
}

export function getAnalytics(): AnalyticsState {
  return loadAnalytics();
}

export class RentalAnalyticsObserver implements Observer {
  update(event: string): void {
    const analytics = loadAnalytics();

    if (event === "rental_started") {
      analytics.activeRentals += 1;
    }

    if (event === "rental_completed") {
      if (analytics.activeRentals > 0) {
        analytics.activeRentals -= 1;
      }
      analytics.completedRentals += 1;
    }

    saveAnalytics(analytics);
  }
}

export class PaymentAnalyticsObserver implements Observer {
  update(event: string): void {
    const analytics = loadAnalytics();

    if (event === "payment_attempted") {
      analytics.paymentAttempts += 1;
    }

    if (event === "payment_successful") {
      analytics.successfulPayments += 1;
    }

    saveAnalytics(analytics);
  }
}

export const rentalAnalyticsObserver = new RentalAnalyticsObserver();
export const paymentAnalyticsObserver = new PaymentAnalyticsObserver();
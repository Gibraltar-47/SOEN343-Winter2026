export type RentalStatus = "reserved" | "active" | "completed";

export interface RentalState {
  getStatus(): RentalStatus;
  start(): RentalStatus;
  end(): RentalStatus;
}

export class ReservedState implements RentalState {
  getStatus(): RentalStatus {
    return "reserved";
  }

  start(): RentalStatus {
    return "active";
  }

  end(): RentalStatus {
    return "reserved";
  }
}

export class ActiveState implements RentalState {
  getStatus(): RentalStatus {
    return "active";
  }

  start(): RentalStatus {
    return "active";
  }

  end(): RentalStatus {
    return "completed";
  }
}

export class CompletedState implements RentalState {
  getStatus(): RentalStatus {
    return "completed";
  }

  start(): RentalStatus {
    return "completed";
  }

  end(): RentalStatus {
    return "completed";
  }
}
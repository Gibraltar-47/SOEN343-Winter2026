export type SafetyStage =
  | "Preparing to depart"
  | "Trip started"
  | "En route"
  | "Near destination"
  | "Arrived safely"
  | "Emergency raised";

export type SafetyShareSession = {
  rentalId: string;
  token: string;
  userId: string;
  userName: string;
  vehicleName: string;
  providerName: string;
  city: string;
  region: string;
  trustedContacts: string[];
  isEnabled: boolean;
  isLive: boolean;
  stage: SafetyStage;
  emergency: boolean;
  createdAt: string;
  activatedAt?: string;
  endedAt?: string;
  lastUpdatedAt: string;
};

const SAFETY_MODE_KEY = "safetyModeSessions";

function getStoredSessions(): Record<string, SafetyShareSession> {
  return JSON.parse(localStorage.getItem(SAFETY_MODE_KEY) || "{}");
}

function saveStoredSessions(sessions: Record<string, SafetyShareSession>) {
  localStorage.setItem(SAFETY_MODE_KEY, JSON.stringify(sessions));
}

function createToken() {
  return `share-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function nowIso() {
  return new Date().toISOString();
}

export const safetyModeService = {
  setupSafetyMode(input: {
    rentalId: string;
    userId: string;
    userName: string;
    vehicleName: string;
    providerName: string;
    city: string;
    region: string;
    trustedContacts: string[];
    enabled: boolean;
  }): SafetyShareSession | null {
    const sessions = getStoredSessions();

    if (!input.enabled) {
      delete sessions[input.rentalId];
      saveStoredSessions(sessions);
      return null;
    }

    const existing = sessions[input.rentalId];
    const session: SafetyShareSession = {
      rentalId: input.rentalId,
      token: existing?.token ?? createToken(),
      userId: input.userId,
      userName: input.userName,
      vehicleName: input.vehicleName,
      providerName: input.providerName,
      city: input.city,
      region: input.region,
      trustedContacts: input.trustedContacts,
      isEnabled: true,
      isLive: existing?.isLive ?? false,
      stage: existing?.stage ?? "Preparing to depart",
      emergency: existing?.emergency ?? false,
      createdAt: existing?.createdAt ?? nowIso(),
      activatedAt: existing?.activatedAt,
      endedAt: existing?.endedAt,
      lastUpdatedAt: nowIso(),
    };

    sessions[input.rentalId] = session;
    saveStoredSessions(sessions);
    return session;
  },

  getSessionByRentalId(rentalId: string): SafetyShareSession | null {
    return getStoredSessions()[rentalId] ?? null;
  },

  getSessionByToken(token: string): SafetyShareSession | null {
    const sessions = Object.values(getStoredSessions());
    return sessions.find((session) => session.token === token) ?? null;
  },

  startLiveSharing(rentalId: string): SafetyShareSession | null {
    const sessions = getStoredSessions();
    const current = sessions[rentalId];
    if (!current) return null;

    const updated: SafetyShareSession = {
      ...current,
      isEnabled: true,
      isLive: true,
      emergency: false,
      stage: current.stage === "Preparing to depart" ? "Trip started" : current.stage,
      activatedAt: current.activatedAt ?? nowIso(),
      endedAt: undefined,
      lastUpdatedAt: nowIso(),
    };

    sessions[rentalId] = updated;
    saveStoredSessions(sessions);
    return updated;
  },

  stopLiveSharing(rentalId: string): SafetyShareSession | null {
    const sessions = getStoredSessions();
    const current = sessions[rentalId];
    if (!current) return null;

    const updated: SafetyShareSession = {
      ...current,
      isLive: false,
      emergency: false,
      stage: current.stage === "Arrived safely" ? current.stage : "Arrived safely",
      endedAt: nowIso(),
      lastUpdatedAt: nowIso(),
    };

    sessions[rentalId] = updated;
    saveStoredSessions(sessions);
    return updated;
  },

  updateStage(rentalId: string, stage: SafetyStage): SafetyShareSession | null {
    const sessions = getStoredSessions();
    const current = sessions[rentalId];
    if (!current) return null;

    const updated: SafetyShareSession = {
      ...current,
      stage,
      emergency: stage === "Emergency raised",
      isLive: true,
      activatedAt: current.activatedAt ?? nowIso(),
      lastUpdatedAt: nowIso(),
    };

    sessions[rentalId] = updated;
    saveStoredSessions(sessions);
    return updated;
  },

  triggerEmergency(rentalId: string): SafetyShareSession | null {
    return this.updateStage(rentalId, "Emergency raised");
  },

  clearSession(rentalId: string) {
    const sessions = getStoredSessions();
    delete sessions[rentalId];
    saveStoredSessions(sessions);
  },

  buildShareLink(token: string) {
    return `${window.location.origin}/trip-share/${token}`;
  },
};
export type SafetyStage =
  | "Preparing to depart"
  | "Trip started"
  | "En route"
  | "Near destination"
  | "Arrived safely"
  | "Emergency raised";

export type TrustedContact = {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
};

export type SafetyNotification = {
  id: string;
  contactId: string;
  contactName: string;
  channel: "email" | "sms";
  status: "sent" | "failed";
  message: string;
  sentAt: string;
};

export type SafetyShareSession = {
  rentalId: string;
  token: string;
  userId: string;
  userName: string;
  vehicleName: string;
  providerName: string;
  city: string;
  region: string;
  trustedContacts: TrustedContact[];
  isEnabled: boolean;
  isLive: boolean;
  canGoLive: boolean;
  stage: SafetyStage;
  emergency: boolean;
  shareSummary: string;
  tripStartedAt?: string;
  expectedReturnAt?: string;
  lastCheckInAt?: string;
  notifications: SafetyNotification[];
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

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function nowIso() {
  return new Date().toISOString();
}

function createNotifications(
  contacts: TrustedContact[],
  message: string,
): SafetyNotification[] {
  const notifications: SafetyNotification[] = [];

  contacts.forEach((contact) => {
    if (contact.email.trim()) {
      notifications.push({
        id: createId("notif"),
        contactId: contact.id,
        contactName: contact.fullName,
        channel: "email",
        status: "sent",
        message,
        sentAt: nowIso(),
      });
    }

    if (contact.phoneNumber.trim()) {
      notifications.push({
        id: createId("notif"),
        contactId: contact.id,
        contactName: contact.fullName,
        channel: "sms",
        status: "sent",
        message,
        sentAt: nowIso(),
      });
    }
  });

  return notifications;
}

function buildStageMessage(session: SafetyShareSession, stage: SafetyStage) {
  switch (stage) {
    case "Trip started":
      return `${session.userName} started the trip with ${session.vehicleName} in ${session.city}, ${session.region}.`;
    case "En route":
      return `${session.userName} is now en route in ${session.city}, ${session.region}.`;
    case "Near destination":
      return `${session.userName} is near the destination.`;
    case "Arrived safely":
      return `${session.userName} has arrived safely.`;
    case "Emergency raised":
      return `Emergency alert: ${session.userName} triggered Safety Mode emergency during the trip.`;
    default:
      return `${session.userName} updated the trip stage to ${stage}.`;
  }
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
    trustedContacts: TrustedContact[];
    enabled: boolean;
    expectedReturnAt?: string;
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
      canGoLive: true,
      stage: existing?.stage ?? "Preparing to depart",
      emergency: existing?.emergency ?? false,
      shareSummary: `Trip in ${input.city}, ${input.region} with ${input.vehicleName}`,
      tripStartedAt: existing?.tripStartedAt,
      expectedReturnAt: input.expectedReturnAt ?? existing?.expectedReturnAt,
      lastCheckInAt: existing?.lastCheckInAt,
      notifications: existing?.notifications ?? [],
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
    if (!current || !current.isEnabled || !current.canGoLive) return null;

    const stage: SafetyStage =
      current.stage === "Preparing to depart" ? "Trip started" : current.stage;

    const updated: SafetyShareSession = {
      ...current,
      isLive: true,
      emergency: false,
      stage,
      tripStartedAt: current.tripStartedAt ?? nowIso(),
      activatedAt: current.activatedAt ?? nowIso(),
      endedAt: undefined,
      lastCheckInAt: nowIso(),
      notifications: [
        ...current.notifications,
        ...createNotifications(current.trustedContacts, buildStageMessage(current, stage)),
      ],
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
      stage: current.stage === "Emergency raised" ? current.stage : "Arrived safely",
      endedAt: nowIso(),
      lastCheckInAt: nowIso(),
      lastUpdatedAt: nowIso(),
    };

    sessions[rentalId] = updated;
    saveStoredSessions(sessions);
    return updated;
  },

  updateStage(rentalId: string, stage: SafetyStage): SafetyShareSession | null {
    const sessions = getStoredSessions();
    const current = sessions[rentalId];
    if (!current || !current.isEnabled || !current.isLive) return null;

    const updated: SafetyShareSession = {
      ...current,
      stage,
      emergency: stage === "Emergency raised",
      lastCheckInAt: nowIso(),
      notifications: [
        ...current.notifications,
        ...createNotifications(current.trustedContacts, buildStageMessage(current, stage)),
      ],
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
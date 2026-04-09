import React from "react";
import { useParams, Link } from "react-router-dom";
import {
  safetyModeService,
  type SafetyShareSession,
} from "../services/safetyModeService";

const labelStyle: React.CSSProperties = {
  fontSize: "0.95rem",
  color: "#4b5563",
  marginBottom: "0.35rem",
};

const valueStyle: React.CSSProperties = {
  fontSize: "1rem",
  fontWeight: 600,
  color: "#111827",
};

const cardStyle: React.CSSProperties = {
  maxWidth: "820px",
  margin: "40px auto",
  padding: "24px",
  borderRadius: "20px",
  background: "#ffffff",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  border: "1px solid #e5e7eb",
};

const sectionStyle: React.CSSProperties = {
  marginTop: "18px",
  padding: "16px",
  borderRadius: "16px",
  background: "#f9fafb",
  border: "1px solid #e5e7eb",
};

const badgeBaseStyle: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 12px",
  borderRadius: "999px",
  fontWeight: 700,
  fontSize: "0.9rem",
};

function getStatusBadgeStyle(session: SafetyShareSession): React.CSSProperties {
  if (session.emergency || session.stage === "Emergency raised") {
    return {
      ...badgeBaseStyle,
      background: "#fee2e2",
      color: "#b91c1c",
    };
  }

  if (session.isLive) {
    return {
      ...badgeBaseStyle,
      background: "#dcfce7",
      color: "#166534",
    };
  }

  return {
    ...badgeBaseStyle,
    background: "#e5e7eb",
    color: "#374151",
  };
}

function formatDateTime(value?: string) {
  if (!value) return "N/A";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleString();
}

export default function TripShare() {
  const { token } = useParams<{ token: string }>();
  const session = token ? safetyModeService.getSessionByToken(token) : null;

  if (!session) {
    return (
      <div style={{ padding: "40px 20px", background: "#f3f4f6", minHeight: "100vh" }}>
        <div style={cardStyle}>
          <h1 style={{ marginTop: 0, fontSize: "1.8rem", color: "#111827" }}>
            Trip Share Not Found
          </h1>
          <p style={{ color: "#4b5563", lineHeight: 1.6 }}>
            This shared trip link is invalid, expired, or no longer available.
          </p>

          <div style={{ marginTop: "20px" }}>
            <Link
              to="/home"
              style={{
                textDecoration: "none",
                display: "inline-block",
                padding: "10px 16px",
                borderRadius: "12px",
                background: "#111827",
                color: "#ffffff",
                fontWeight: 600,
              }}
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 20px", background: "#f3f4f6", minHeight: "100vh" }}>
      <div style={cardStyle}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ margin: 0, fontSize: "2rem", color: "#111827" }}>
              Live Trip Safety Share
            </h1>
            <p style={{ marginTop: "8px", color: "#6b7280" }}>
              Shared trip status for safety monitoring.
            </p>
          </div>

          <span style={getStatusBadgeStyle(session)}>
            {session.emergency ? "Emergency" : session.isLive ? "Live" : "Offline"}
          </span>
        </div>

        <div style={sectionStyle}>
          <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <div>
              <div style={labelStyle}>Traveler</div>
              <div style={valueStyle}>{session.userName}</div>
            </div>

            <div>
              <div style={labelStyle}>Vehicle</div>
              <div style={valueStyle}>{session.vehicleName}</div>
            </div>

            <div>
              <div style={labelStyle}>Provider</div>
              <div style={valueStyle}>{session.providerName}</div>
            </div>

            <div>
              <div style={labelStyle}>Trip Area</div>
              <div style={valueStyle}>{session.city}, {session.region}</div>
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <div style={labelStyle}>Trip Summary</div>
          <div style={{ ...valueStyle, fontSize: "1.05rem" }}>{session.shareSummary}</div>
        </div>

        <div style={sectionStyle}>
          <div style={labelStyle}>Current Stage</div>
          <div style={{ ...valueStyle, fontSize: "1.1rem" }}>{session.stage}</div>

          {session.emergency && (
            <div
              style={{
                marginTop: "14px",
                padding: "14px",
                borderRadius: "14px",
                background: "#fee2e2",
                color: "#991b1b",
                border: "1px solid #fecaca",
                fontWeight: 600,
              }}
            >
              Emergency alert has been triggered for this trip.
            </div>
          )}
        </div>

        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0, color: "#111827", fontSize: "1.15rem" }}>
            Trip Timeline
          </h2>

          <div style={{ display: "grid", gap: "14px", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            <div>
              <div style={labelStyle}>Created</div>
              <div style={valueStyle}>{formatDateTime(session.createdAt)}</div>
            </div>

            <div>
              <div style={labelStyle}>Trip Started</div>
              <div style={valueStyle}>{formatDateTime(session.tripStartedAt)}</div>
            </div>

            <div>
              <div style={labelStyle}>Expected Return</div>
              <div style={valueStyle}>{formatDateTime(session.expectedReturnAt)}</div>
            </div>

            <div>
              <div style={labelStyle}>Last Check-In</div>
              <div style={valueStyle}>{formatDateTime(session.lastCheckInAt)}</div>
            </div>

            <div>
              <div style={labelStyle}>Last Updated</div>
              <div style={valueStyle}>{formatDateTime(session.lastUpdatedAt)}</div>
            </div>

            <div>
              <div style={labelStyle}>Ended</div>
              <div style={valueStyle}>{formatDateTime(session.endedAt)}</div>
            </div>
          </div>
        </div>

        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0, color: "#111827", fontSize: "1.15rem" }}>
            Trusted Contacts Notified
          </h2>

          {session.trustedContacts.length === 0 ? (
            <p style={{ margin: 0, color: "#6b7280" }}>
              No trusted contacts were added.
            </p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: "20px", color: "#111827", lineHeight: 1.8 }}>
              {session.trustedContacts.map((contact) => (
                <li key={contact.id}>
                  {contact.fullName}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={sectionStyle}>
          <h2 style={{ marginTop: 0, color: "#111827", fontSize: "1.15rem" }}>
            Notification Log
          </h2>

          {session.notifications.length === 0 ? (
            <p style={{ margin: 0, color: "#6b7280" }}>
              No notifications have been sent yet.
            </p>
          ) : (
            <ul style={{ margin: 0, paddingLeft: "20px", color: "#111827", lineHeight: 1.8 }}>
              {session.notifications.slice(-8).reverse().map((notification) => (
                <li key={notification.id}>
                  {notification.channel.toUpperCase()} sent to {notification.contactName} at {formatDateTime(notification.sentAt)}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div style={{ marginTop: "22px", display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <Link
            to="/home"
            style={{
              textDecoration: "none",
              display: "inline-block",
              padding: "10px 16px",
              borderRadius: "12px",
              background: "#111827",
              color: "#ffffff",
              fontWeight: 600,
            }}
          >
            Back to Home
          </Link>

          <Link
            to="/my-rentals"
            style={{
              textDecoration: "none",
              display: "inline-block",
              padding: "10px 16px",
              borderRadius: "12px",
              background: "#e5e7eb",
              color: "#111827",
              fontWeight: 600,
            }}
          >
            My Rentals
          </Link>
        </div>
      </div>
    </div>
  );
}
import type Client from "../types/user";
import type { ClientRole } from "../types/user";
import { UserFactory } from "../patterns/entityFactory";

const CLIENTS_KEY = "clients";

export function getClients(): Client[] {
  return JSON.parse(localStorage.getItem(CLIENTS_KEY) || "[]");
}

export function saveClients(clients: Client[]) {
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients));
}

export function registerClient(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  role: ClientRole = "user"
): { success: boolean; message: string } {
  const clients = getClients();

  const exists = clients.some(
    (client) => client.email.toLowerCase() === email.toLowerCase()
  );

  if (exists) {
    return {
      success: false,
      message: "A client with this email already exists.",
    };
  }

  const newClient = UserFactory.createClient(
    firstName,
    lastName,
    email,
    password,
    role
  );

  clients.push(newClient);
  saveClients(clients);

  return { success: true, message: "Sign up successful!" };
}

export function loginClient(
  email: string,
  password: string
): Client | null {
  const clients = getClients();

  const matchedClient = clients.find(
    (client) =>
      client.email.toLowerCase() === email.toLowerCase() &&
      client.password === password
  );

  return matchedClient || null;
}
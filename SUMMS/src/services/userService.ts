import Client from "../types";
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
  password: string
): { success: boolean; message: string } {
  const clients = getClients();

  const exists = clients.some(
    (client) => client.email.toLowerCase() === email.toLowerCase()
  );

  if (exists) {
    return { success: false, message: "A client with this email already exists." };
  }

  const newClient = UserFactory.createClient(firstName, lastName, email, password);
  clients.push(newClient);
  saveClients(clients);

  return { success: true, message: "Sign up successful!" };
}

export function loginClient(email: string): boolean {
  const clients = getClients();
  return clients.some(
    (client) => client.email.toLowerCase() === email.toLowerCase()
  );
}
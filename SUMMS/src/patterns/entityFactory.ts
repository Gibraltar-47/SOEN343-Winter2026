import type Client from "../types/user";
import type { ClientRole } from "../types/user";

export class UserFactory {
  static createClient(
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: ClientRole = "user"
  ): Client {
    return {
      id: `client-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      firstName,
      lastName,
      email,
      password,
      role,
    };
  }
}
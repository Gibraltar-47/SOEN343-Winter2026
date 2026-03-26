import Client from "../types";

export class UserFactory {
  static createClient(
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ): Client {
    return {
      firstName,
      lastName,
      email,
      password,
    };
  }
}
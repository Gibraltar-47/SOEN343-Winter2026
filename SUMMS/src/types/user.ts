export type ClientRole = "user" | "admin" | "provider";

type Client = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: ClientRole;
};

export default Client;
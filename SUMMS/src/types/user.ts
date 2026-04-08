export type ClientRole = "user" | "admin" | "provider";

type Client = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: ClientRole;
};

export default Client;
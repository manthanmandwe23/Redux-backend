export interface User {
  id: string;
  username: string;
  fullname: string;
  email: string;
  password: string;
  role: "user" | "admin";
  refreshtoken: string | null;
  address: string | null;
  phone: string | null;
  created_at: Date;
  updated_at: Date;
  avatar_url: string;
  avatar_public_id: string;
}

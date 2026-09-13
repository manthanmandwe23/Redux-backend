// in this form data coming from backend will look like
export interface RegisterUser {
  id: string;
  username: string;
  fullname: string;
  email: string;
  role: "user" | "admin";
  address: string | null;
  phone: string | null;
  avatar_url: string;
  avatar_public_id: string;
}

export interface GetCurUser {
  id: string;
  username: string;
  fullname: string;
  email: string;
  role: "user" | "admin";
  address: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
  avatar_url: string;
  avatar_public_id: string;
}

//in this form data we sending from frontend to backend will look like
export interface User {
  username: string;
  fullname: string;
  email: string;
  password: string;
  role: "user" | "admin";
  address: string | null;
  phone: string | null;
}

export interface loginUserfromFrontend {
  username: string;
  email: string;
  password: string;
}

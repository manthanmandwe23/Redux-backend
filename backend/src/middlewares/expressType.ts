import type { User } from "../models/user_model.js";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

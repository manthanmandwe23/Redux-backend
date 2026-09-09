import jwt from "jsonwebtoken";
import type { User } from "../models/user_model.js";
import "dotenv/config";

const p = process.env;
export const generateAccessToken = (user: User): string => {
  const AccessSecret = p.ACCESS_TOKEN_SECRET;
  const AccessExpiry = p.ACCESS_TOKEN_EXPIRY;

  if (!AccessSecret) {
    throw new Error("ACCESS_TOKEN_SECRET is not defined");
  }
  if (!AccessExpiry) {
    throw new Error("ACCESS_TOKEN_EXPIRY is not defined");
  }
  return jwt.sign(
    {
      _id: user.id,
      username: user.username,
      email: user.email,
    },
    AccessSecret,
    {
      expiresIn: AccessExpiry as NonNullable<jwt.SignOptions["expiresIn"]>,
    },
  );
};

export const generateRefreshToken = (user: User): string => {
  const RefreshSecret = p.REFRESH_TOKEN_SECRET;
  const RefreshExpiry = p.REFRESH_TOKEN_EXPIRY;
  if (!(RefreshSecret && RefreshExpiry)) {
    throw new Error("REFRESH_TOKEN expiry and secret is not defined");
  }
  return jwt.sign(
    {
      _id: user.id,
    },
    RefreshSecret,
    {
      expiresIn: RefreshExpiry as NonNullable<jwt.SignOptions["expiresIn"]>,
    },
  );
};

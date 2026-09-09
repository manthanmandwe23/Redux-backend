import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";
import pool from "../config/db.js";

const verifyJWT = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new ApiError(409, "token not found");
    }
    const accessSecret = process.env.ACCESS_TOKEN_SECRET;
    if (!accessSecret) {
      throw new ApiError(409, "access tokn secreet required");
    }
    interface JwtPayloadWithId extends jwt.JwtPayload {
      _id: string;
    }
    const decodedtoken = (await jwt.verify(
      token,
      accessSecret,
    )) as JwtPayloadWithId;
    if (!decodedtoken) {
      throw new ApiError(500, "unable to decode token ");
    }
    const user = await pool.query(
      `select * from users
     where id = $1
     `,
      [decodedtoken._id],
    );

    if (user.rows.length === 0) {
      throw new ApiError(404, "user not found");
    }
    req.user = user.rows[0];
    next();
  },
);
export default verifyJWT;

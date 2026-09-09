import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response } from "express";
import uploadOnCloudinary from "../utils/cloudinary.js";
import {
  createUser,
  findUserByUsernameOrEmail,
} from "../repository/user_repository.js";
import { upload } from "../middlewares/multer_middleware.js";
import { comparePassword, hashPassword } from "../utils/password.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import type { User } from "../models/user_model.js";
import ApiResponse from "../utils/ApiResponse.js";
import pool from "../config/db.js";

const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, fullname, email, password, role, address, phone } =
    req.body;
  if (
    [username, email, fullname, password].some((field) => {
      return !field?.trim();
    })
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = await findUserByUsernameOrEmail(username, email);
  if (existedUser) {
    throw new ApiError(409, "user already exists");
  }

  const avatarlocalpath = req.file?.path;
  if (!avatarlocalpath) {
    throw new ApiError(400, "avatar is required");
  }
  const uploads = await uploadOnCloudinary(avatarlocalpath);
  if (!uploads) {
    throw new ApiError(500, "failed to upload avatar");
  }
  const hashedpass = await hashPassword(password);
  const user = await createUser(
    username,
    fullname,
    email,
    hashedpass,
    role,
    address,
    phone,
    uploads.secure_url,
    uploads.public_id,
  );
  if (!user) {
    throw new ApiError(500, "failed to register user");
  }
  return res
    .status(201)
    .json(new ApiResponse(201, user, "user registered successfully"));
});

const generateAccessANDRefreshToken = async (user: User) => {
  if (!user) {
    throw new ApiError(400, "id required");
  }
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  return {
    accessToken,
    refreshToken,
  };
};

const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  if (!(username || email)) {
    throw new ApiError(409, "username or email is required");
  }
  const user = await findUserByUsernameOrEmail(username, email);
  if (!user) {
    throw new ApiError(404, "user not found");
  }
  const pass = await comparePassword(password, user.password);
  if (!pass) {
    throw new ApiError(400, "Incorrect password");
  }
  const { accessToken, refreshToken } =
    await generateAccessANDRefreshToken(user);
  if (!(accessToken && refreshToken)) {
    throw new ApiError(500, "unable to generate token");
  }

  const options = {
    httpOnly: true,
    secure: false,
  };

  await pool.query(`update users set refreshtoken = $1 where id = $2`, [
    refreshToken,
    user.id,
  ]);

  const user1 = await findUserByUsernameOrEmail(username, email);
  const { password: _, refreshtoken, ...safeUser } = user1;
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, safeUser, "user logged in successfully"));
});

const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "user not authenticated");
  }
  await pool.query(`update users set refreshtoken = $1 where id = $2`, [
    null,
    req.user.id,
  ]);

  const options = {
    httpOnly: true,
    secure: false,
  };
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user logged out succesfully"));
});

const getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new ApiError(401, "user not authenticated");
  }
  const user = await pool.query(`select * from users where id = $1`, [
    req.user.id,
  ]);
  if (user.rows.length === 0) {
    throw new ApiError(404, "user not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, user.rows[0], "user fetched successfully"));
});

export { registerUser, loginUser, logoutUser, getCurrentUser };

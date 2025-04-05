import { AuthRequest } from "@/types/requestTypes";
import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401);
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in the environment variables");
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET,
    (err: jwt.VerifyErrors | null, user: any) => {
      if (err) {
        return res.status(403);
      }
      req.user = user;
      next();
    }
  );
}

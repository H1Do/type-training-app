import { ApiError } from "../errors/ApiError";
import { NextFunction, Request, Response } from "express";
import { ErrorRequestHandler } from "express";

export const errorMiddleware: ErrorRequestHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    res.status(err.status).json({
      status: "error",
      message: err.message,
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    status: "error",
    message: "Internal Server Error",
  });
};

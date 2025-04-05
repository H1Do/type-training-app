import { Router } from "express";
import { userController } from "../controllers/userController";
import { AuthRequest } from "@/types/requestTypes";

export const userRouter = Router();

userRouter.post("/registration", async (req, res, next) => {
  try {
    await userController.registration(req as AuthRequest, res, next);
  } catch (error) {
    next(error);
  }
});
userRouter.post("/login", async (req, res, next) => {
  try {
    await userController.login(req as AuthRequest, res, next);
  } catch (error) {
    next(error);
  }
});

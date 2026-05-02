import express from "express";
import getCurrentUser from "../controllers/user.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import { get } from "mongoose";

const userRouter = express.Router();

userRouter.get("/me", verifyToken, getCurrentUser);

export default userRouter;

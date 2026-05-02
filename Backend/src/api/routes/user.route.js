import express from "express";
import getCurrentUser from "../controllers/user.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
import { getConfiguration, updateConfiguration } from "../controllers/config.controller.js";

const userRouter = express.Router();

userRouter.get("/me", verifyToken, getCurrentUser);
userRouter.get("/configuration", verifyToken, getConfiguration);
userRouter.post("/configuration", verifyToken, updateConfiguration);

export default userRouter;

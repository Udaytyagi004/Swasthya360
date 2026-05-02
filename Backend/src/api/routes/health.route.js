import express from "express";
import handleHealthRequest from "../controllers/health.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";
const healthRouter = express.Router();

healthRouter.post("/services", verifyToken, handleHealthRequest);

export default healthRouter;

import express from "express";
import handleHealthRequest from "../controllers/health.controller.js";
const healthRouter = express.Router();

healthRouter.post("/services", handleHealthRequest);

export default healthRouter;

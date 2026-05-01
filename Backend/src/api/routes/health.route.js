import express from "express";
import handleHealthRequest from "../controllers/health.controller";
const healthRouter = express.Router();

healthRouter.post("/services", handleHealthRequest);

export default healthRouter;

import "./config/env.js";
import express from "express";
import cors from "cors";
import  handleRequest  from "./api/healthServices.js";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/health-services", async (req, res) => {
  const input = req.body;

  try {
    const result = await handleRequest(input);
    res.json(result);
  } catch (error) {
    console.error("[Server Error]:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.listen(3000, () => console.log("Agent Microservice online on :3000"));

import "./config/env.js";
import express from "express";
import cors from "cors";
import connectDB from "./db/connection.js";

import authRouter from "./api/routes/authRouter.js";
import healthRouter from "./api/routes/healthRouter.js";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.use("/", authRouter);
app.use("/health", healthRouter);

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Agent Microservice online on port ${PORT}`),
    );
  })
  .catch((error) => {
    console.error("Failed to connect to database. Server not started.", error);
  });

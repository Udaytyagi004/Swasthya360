import "./config/env.js";
import express from "express";
import cors from "cors";
import connectDB from "./db/connection.js";
import cookieParser from "cookie-parser";
import authRouter from "./api/routes/auth.route.js";
import healthRouter from "./api/routes/health.route.js";
import userRouter from "./api/routes/user.route.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
const PORT = process.env.PORT;

app.use("/auth", authRouter);
app.use("/health", healthRouter);
app.use("/user", userRouter);

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Agent Microservice online on port ${PORT}`),
    );
  })
  .catch((error) => {
    console.error("Failed to connect to database. Server not started.", error);
  });

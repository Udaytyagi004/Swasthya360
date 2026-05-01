import express from "express";
const authRouter = express.Router();

// login APi
authRouter.get("/login", (req, res) => {
  res.send("Login endpoint - To be implemented");
});

export default authRouter;

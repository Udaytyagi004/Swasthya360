import { signupSchema, loginSchema } from "../../utils/schemas.js";
import { signupService, loginService } from "../../services/auth.service.js";

export const signup = async (req, res) => {
  try {
    const validatedData = signupSchema.parse(req.body);

    const { user, token } = await signupService(validatedData);
    res.cookie("token", token);
    res.status(201).send("SignUp succesful");
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
};

export const login = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const { user, token } = await loginService(validatedData);
    res.cookie("token", token);
    res.send("login Succesful");
  } catch (error) {
    res.status(400).send("Error : " + error.message);
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.send("Logged out successfully");
};

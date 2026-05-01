import User from "../db/models/user.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/jwt.js";

export const signupService = async (data) => {
  const { name, email, password, age, gender, location } = data;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    age,
    gender,
    location,
  });

  const token = generateToken(user);

  return { user, token };
};

export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user);

  return { user, token };
};

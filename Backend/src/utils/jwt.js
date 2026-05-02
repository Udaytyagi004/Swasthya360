import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      name: user.name,
      emergencyContact: user.emergencyContact,
    },
    JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};
export default generateToken;

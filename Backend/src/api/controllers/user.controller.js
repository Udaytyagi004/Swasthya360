import { email } from "zod";
import User from "../../db/models/user.js";
const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select(
      "-password",
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export default getCurrentUser;

import triageService from "../../services/triage.service.js";

const handleHealthRequest = async (req, res) => {
  try {
    const input = {
      ...req.body,

      user: {
        name: req.user.name,
        emergencyContact: req.user.emergencyContact,
      },
    };

    const result = await triageService(input);

    res.json(result);
  } catch (err) {
    console.error("Health Request Error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default handleHealthRequest;

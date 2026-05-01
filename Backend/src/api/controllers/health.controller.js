import triageService from "../../services/triage.service.js";

const handleHealthRequest = async (req, res) => {
  const input = req.body;

  const result = await triageService(input);

  res.json(result);
};

export default handleHealthRequest;

import express from "express";
import medService  from "./graph/workflow.js";

const app = express();
app.use(express.json());

app.post("/medical-services", async (req, res) => {
 
  const input = req.body;

  try {
    
    const result = await medService.invoke({
      rawSymptoms: input.symptoms,
      context: input.context,
      otherInfo: input.otherInfo
    });

    if (!result.diagnosis) {
      return res.status(500).json({
        status: "error",
        message: "Diagnosis failed to generate. The Gemini API might have thrown an error (e.g., Insufficient Quota)."
      });
    }

    const payload = {
      status: "success",
      diagnosis: result.diagnosis.disease,
      confidence: result.diagnosis.confidence,
      preventive_measures: result.diagnosis.preventiveMeasures,
      suggested_cure: result.diagnosis.cure,
      emergency_triggered: result.diagnosis.isEmergency
    };
    
    res.json(payload);

  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.listen(3000, () => console.log("Agent Microservice online on :3000"));
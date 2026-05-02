import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ClinicalAssessmentSchema } from "../utils/schemas.js";
import { SYSTEM_PROMPTS } from "../config/prompts.js";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-flash-lite-preview",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0,
});

const clinicalAgent = async (state) => {
  const structuredLlm = model.withStructuredOutput(ClinicalAssessmentSchema);

  const systemPrompt = SYSTEM_PROMPTS.CLINICAL_AGENT;

  const inputContext = `
  Symptoms: ${state.symptoms ? state.symptoms.join(", ") : "None"}
  Severity: ${state.severity || "Unknown"}/10
  Duration: ${state.duration || "Unknown"}
  Additional Context: ${JSON.stringify(state.context || {})}
  `;

  try {
    const response = await structuredLlm.invoke([
      ["system", systemPrompt],
      ["human", inputContext],
    ]);

    console.log(
      `[Clinical Agent] Analysis complete. Diagnosis: ${response.diagnosis.disease}. Risk: ${response.riskAssessment.riskLevel}`,
    );

    return {
      diagnosis: response.diagnosis,
      riskAssessment: response.riskAssessment,
    };
  } catch (error) {
    console.error("[Clinical Agent] Error:", error);
    return {
      diagnosis: {
        disease: "Error in analysis",
        isEmergency: false,
        preventiveMeasures: [],
        cure: "Consult doctor",
        confidence: 0,
      },
      riskAssessment: {
        riskLevel: "Medium",
        reasoning: "Error occurred during AI analysis.",
      },
    };
  }
};

export default clinicalAgent;

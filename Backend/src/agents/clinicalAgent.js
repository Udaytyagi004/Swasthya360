import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ClinicalAssessmentSchema } from "../utils/schemas.js";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-flash-lite-preview",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0,
});

const clinicalAgent = async (state) => {
  const structuredLlm = model.withStructuredOutput(ClinicalAssessmentSchema);

  const systemPrompt = `You are a professional Medical Expert AI.
  Analyze the patient's symptoms and provide a comprehensive clinical assessment.
  
  1. DIAGNOSIS: Provide a probable disease, confidence score, preventive measures, and cure.
  2. RISK ASSESSMENT: Evaluate the medical urgency (Low, Medium, High, Emergency).
  
  CRITICAL: If symptoms are life-threatening (e.g., severe chest pain, inability to breathe), you MUST set riskLevel to 'Emergency' and isEmergency to true.`;

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

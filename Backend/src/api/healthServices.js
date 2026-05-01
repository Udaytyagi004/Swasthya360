import { executeTriage } from "../orchestrator/orchestrator.js";

const handleRequest = async (input) => {
  try {
    const state = await executeTriage(input);

    if (state.intent === "medical" || state.intent === "emergency") {
      return {
        status: "success",
        intent: state.intent,
        type: "diagnosis_response",
        plan: state.plan,
        reasoning: state.reasoning,
        diagnosis: state.diagnosis?.disease || "Undetermined",
        confidence: state.diagnosis?.confidence || 0,
        risk_level: state.riskAssessment?.riskLevel || "Low",
        preventive_measures: state.diagnosis?.preventiveMeasures || [],
        suggested_cure: state.diagnosis?.cure || "Consult a doctor",
        emergency_triggered:
          state.intent === "emergency" || state.diagnosis?.isEmergency || false,
      };
    }

    if (state.intent === "chat") {
      return {
        status: "success",
        intent: "chat",
        type: "chat_response",
        plan: state.plan,
        reasoning: state.reasoning,
        message:
          state.chatResponse?.message ||
          "I'm here to help. Could you please provide more details?",
      };
    }

    return {
      status: "error",
      message: "Unable to determine intent or generate a structured response.",
    };
  } catch (error) {
    console.error("[HealthServices] Error handling request:", error);
    return {
      status: "error",
      message: error.message || "Internal Server Error",
    };
  }
};
export default handleRequest;

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";
import { ControllerSchema } from "../utils/schemas.js";
import { SYSTEM_PROMPTS } from "../config/prompts.js";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-flash-lite-preview",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0,
});

const controllerAgent = async (state) => {
  const structuredLlm = model.withStructuredOutput(ControllerSchema);
  
  // Inject state variables into the template string
  let systemPrompt = SYSTEM_PROMPTS.CONTROLLER_AGENT
    .replace("{{query}}", state.query || "None")
    .replace("{{symptoms}}", state.symptoms?.join(", ") || "None")
    .replace("{{severity}}", state.severity ?? "Unknown");

  try {
    const response = await structuredLlm.invoke([
      ["system", systemPrompt],
      [
        "human",
        "Analyze the situation and provide the most effective execution plan.",
      ],
    ]);

    console.log(
      `[Controller] Intent: ${response.intent}. Plan: ${response.plan.join(" -> ")}`,
    );
    console.log(`[Controller] Reasoning: ${response.reasoning}`);

    return {
      intent: response.intent,
      plan: response.plan,
      reasoning: response.reasoning,
      step: 0,
    };
  } catch (error) {
    console.error("[Controller] Error:", error);
    // Default fallback
    return {
      intent: "chat",
      plan: ["chatAgent"],
      reasoning: "Fallback triggered due to internal error.",
      step: 0,
    };
  }
};

export default controllerAgent;

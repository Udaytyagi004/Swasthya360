import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { z } from "zod";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-flash-lite-preview",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0,
});

const ControllerSchema = z.object({
  intent: z
    .enum(["chat", "medical", "emergency"])
    .describe("The understood intent of the user"),
  plan: z
    .array(z.string())
    .describe(
      "The list of agents to call in order. Options: diagnosisAgent, riskAgent, actionAgent, chatAgent",
    ),
  reasoning: z.string().describe("Brief explanation for the chosen plan"),
});

const controllerAgent = async (state) => {
  const structuredLlm = model.withStructuredOutput(ControllerSchema);
  const systemPrompt = `
You are a medical triage planner.

Task:
- Identify intent: "chat", "medical", or "emergency"
- Return a minimal plan using available agents

Agents:
- clinicalAgent → diagnosis + risk
- actionAgent → immediate steps
- chatAgent → conversation / clarification

Guidelines:
- Chat → ["chatAgent"]
- Medical → ["clinicalAgent", "actionAgent"]
- Emergency OR severity > 7 → ["actionAgent"] first
- If symptoms unclear → start with ["chatAgent"]
- Keep plan minimal (only necessary steps)

Input:
Query: ${state.query || "None"}
Symptoms: ${state.symptoms?.join(", ") || "None"}
Severity: ${state.severity ?? "Unknown"}/10
`;
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

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

  const systemPrompt = `You are a Strategic Medical Triage Controller. Your goal is to design a workflow that best serves the user's immediate needs while ensuring safety.

  DESIGN GUIDELINES:
  - 'chat': For greetings, general medical questions, or non-symptom queries. Usually just ["chatAgent"].
  - 'medical': For specific symptom checking. Usually ["clinicalAgent", "actionAgent"].
  - 'emergency': For life-threatening symptoms (chest pain, breathing issues, severe bleeding). Usually starts with ["actionAgent"] for immediate life-saving steps, followed by ["chatAgent"] or ["clinicalAgent"].

  DYNAMIC PLANNING RULES:
  1. ADAPT TO SEVERITY: If severity is high (>7), prioritize "actionAgent" to provide immediate guidance.
  2. ADAPT TO SYMPTOMS: If symptoms are vague, use "chatAgent" first to clarify before "clinicalAgent".
  3. OPTIMIZE FLOW: Only include agents that add value to the specific user context.

  AVAILABLE AGENTS:
  - 'clinicalAgent': Diagnostic analysis and risk assessment.
  - 'actionAgent': Immediate medical instructions and first aid.
  - 'chatAgent': General conversational support and information gathering.

  Current Input:
  Query: ${state.query || "None"}
  Symptoms: ${state.symptoms ? state.symptoms.join(", ") : "None"}
  Severity: ${state.severity || "Unknown"}/10
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

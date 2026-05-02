import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { SYSTEM_PROMPTS } from "../config/prompts.js";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3-flash-lite-preview",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.7,
});

const chatAgent = async (state) => {
  const systemPrompt = SYSTEM_PROMPTS.CHAT_AGENT;

  const query = state.query || "Hello";

  try {
    const response = await model.invoke([
      ["system", systemPrompt],
      ["human", query],
    ]);

    return {
      chatResponse: {
        status: "success",
        type: "chat_response",
        message: response.content,
      },
    };
  } catch (error) {
    console.error("[chatAgent] Error:", error);
    return {
      chatResponse: {
        status: "error",
        type: "chat_response",
        message: "I am currently unavailable to chat. Please try again later.",
      },
    };
  }
};

export default chatAgent;

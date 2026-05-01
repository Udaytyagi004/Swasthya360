import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-3.1-flash-lite-preview",
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0.7,
});

const chatAgent = async (state) => {
  const systemPrompt = `You are a helpful and empathetic medical support assistant. 
    You are here to answer general questions, provide support, or guide the user.
    If the user reports specific symptoms or asks for a diagnosis, politely guide them to use the symptom diagnosis feature.
    Keep your answers concise and supportive.`;

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

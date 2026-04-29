import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { DiagnosisSchema } from "../utils/schemas.js";
import dotenv from "dotenv";
dotenv.config();

const model = new ChatGoogleGenerativeAI({
  
  model: "gemini-3-flash-preview", 
  apiKey: process.env.GOOGLE_API_KEY,
  temperature: 0,
});

const diagnosisAgent = async (state) => {
  

  const structuredLlm = model.withStructuredOutput(DiagnosisSchema);

  const systemPrompt = `You are a professional medical Assistant AI. 
    Analyze the patient's symptoms and provide a probable diagnosis, preventive measures, and cure. 
    CRITICAL: If the symptoms indicate a life-threatening condition (e.g., severe chest pain, difficulty breathing), set isEmergency to true.`;

  try {
    const response = await structuredLlm.invoke([
      ["system", systemPrompt],
      ["human", state.processedSymptomString]
    ]);

    return { 
      diagnosis: response,
      
    };
  } catch (error) {
      return { 
        diagnosis: { 
        disease: "Error in analysis", 
        isEmergency: false, 
        preventiveMeasures: [], 
        cure: "Please consult a doctor manually.",
        confidence: 0
      }
    };
  }
};

export default diagnosisAgent;
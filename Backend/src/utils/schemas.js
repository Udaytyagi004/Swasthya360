import { z } from "zod";

export const DiagnosisSchema = z.object({
  disease: z.string().describe("The name of the diagnosed disease"),
  confidence: z.number().describe("Confidence score between 0 and 1"),
  preventiveMeasures: z
    .array(z.string())
    .describe("List of preventive measures"),
  cure: z.string().describe("Suggested cure or treatment"),
  isEmergency: z
    .boolean()
    .describe("True if symptoms indicate a life-threatening medical emergency"),
});
export const RiskAssessmentSchema = z.object({
  riskLevel: z
    .enum(["Low", "Medium", "High", "Emergency"])
    .describe(
      "The assessed level of medical risk based on symptoms and context",
    ),
  reasoning: z
    .string()
    .describe("The medical reasoning behind the risk assessment"),
});

export const ClinicalAssessmentSchema = z.object({
  diagnosis: DiagnosisSchema,
  riskAssessment: RiskAssessmentSchema,
});

export const ControllerSchema = z.object({
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

export const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  age: z.number().min(0).max(120).optional(),
  gender: z.enum(["male", "female", "other"]).optional(),
  location: z.string().optional(),
  emergencyContact: z
    .string()
    .regex(/^\+?[1-9]\d{9,14}$/, "Invalid phone number format"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

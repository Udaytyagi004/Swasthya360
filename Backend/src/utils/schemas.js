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

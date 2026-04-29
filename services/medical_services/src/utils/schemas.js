import { z } from "zod";

export const DiagnosisSchema = z.object({
  disease: z.string(),
  confidence: z.number(),
  preventiveMeasures: z.array(z.string()),
  cure: z.string(),
  isEmergency: z.boolean()
});


export const StateSchema = {
  userId: null,
  rawSymptoms: [], 
  otherInfo: {},
  extractedContext: "", 
  diagnosis: null,
  alertSent: false
};
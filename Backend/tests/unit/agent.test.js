import { jest } from "@jest/globals";



const mockInvoke = jest.fn();

jest.unstable_mockModule("@langchain/google-genai", () => ({
  ChatGoogleGenerativeAI: jest.fn(() => ({
    invoke: mockInvoke,
    withStructuredOutput: () => ({
      invoke: mockInvoke,
    }),
  })),
}));


const mockSend = jest.fn();

jest.unstable_mockModule("../../src/tools/whatsappTool.js", () => ({
  default: mockSend,
}));



const { default: chatAgent } = await import("../../src/agents/chatAgent.js");
const { default: clinicalAgent } = await import("../../src/agents/clinicalAgent.js");
const { default: controllerAgent } = await import("../../src/agents/controllerAgent.js");
const { default: actionAgent } = await import("../../src/agents/actionAgent.js");



describe("Agent Tests", () => {

  describe("chatAgent", () => {
    test("should return chat response", async () => {
      mockInvoke.mockResolvedValueOnce({
        content: "Hello! How can I help you?",
      });

      const result = await chatAgent({ query: "Hi" });

      expect(result.chatResponse.status).toBe("success");
      expect(result.chatResponse.message).toBeDefined();
    });

    test("should handle error", async () => {
      mockInvoke.mockRejectedValueOnce(new Error("API error"));

      const result = await chatAgent({ query: "Hi" });

      expect(result.chatResponse.status).toBe("error");
    });
  });

  describe("clinicalAgent", () => {
    test("should return diagnosis and risk", async () => {
      mockInvoke.mockResolvedValueOnce({
        diagnosis: {
          disease: "Flu",
          confidence: 0.8,
          preventiveMeasures: [],
          cure: "Rest",
        },
        riskAssessment: {
          riskLevel: "Low",
          reasoning: "Mild symptoms",
        },
      });

      const result = await clinicalAgent({
        symptoms: ["fever"],
        severity: 3,
      });

      expect(result.diagnosis.disease).toBe("Flu");
      expect(result.riskAssessment.riskLevel).toBe("Low");
    });

    test("should handle error fallback", async () => {
      mockInvoke.mockRejectedValueOnce(new Error("API failed"));

      const result = await clinicalAgent({});

      expect(result.diagnosis.disease).toBe("Error in analysis");
      expect(result.riskAssessment.riskLevel).toBe("Medium");
    });
  });

  describe("controllerAgent", () => {
    test("should return plan", async () => {
      mockInvoke.mockResolvedValueOnce({
        intent: "medical",
        plan: ["clinicalAgent", "actionAgent"],
        reasoning: "User has symptoms",
      });

      const result = await controllerAgent({
        query: "I have fever",
        severity: 5,
      });

      expect(result.intent).toBe("medical");
      expect(result.plan).toContain("clinicalAgent");
    });

    test("should fallback on error", async () => {
      mockInvoke.mockRejectedValueOnce(new Error("API error"));

      const result = await controllerAgent({});

      expect(result.intent).toBe("chat");
      expect(result.plan).toContain("chatAgent");
    });
  });

  
  describe("actionAgent", () => {
    test("should trigger emergency and send WhatsApp", async () => {
      mockSend.mockResolvedValueOnce({ success: true });

      const result = await actionAgent({
        severity: 9,
        symptoms: ["chest pain"],
        user: { emergencyContact: "9876543210" },
      });

      expect(result.actionTaken).toBe(true);
      expect(result.alertStatus).toBe("sent");
      expect(mockSend).toHaveBeenCalled();
    });

    test("should skip if no emergency contact", async () => {
      const result = await actionAgent({
        severity: 9,
        symptoms: ["chest pain"],
        user: {},
      });

      expect(result.alertStatus).toContain("skipped");
    });

    test("should not trigger for low severity", async () => {
      const result = await actionAgent({
        severity: 2,
        symptoms: ["headache"],
        user: {},
      });

      expect(result.actionTaken).toBeUndefined();
    });
  });

});
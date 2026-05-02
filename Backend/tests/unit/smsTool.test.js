import { jest } from "@jest/globals";

const mockCreate = jest.fn(async () => ({
  sid: "mock_sid_123",
}));

jest.unstable_mockModule("twilio", () => ({
  default: jest.fn(() => ({
    messages: {
      create: mockCreate,
    },
  })),
}));


const { default: sendEmergencyWhatsApp } = await import(
  "../../src/tools/whatsappTool.js"
);

describe("WhatsApp Tool", () => {
  test("should send message successfully", async () => {
    const result = await sendEmergencyWhatsApp({
      to: "9876543210",
      message: "Emergency alert",
    });

    expect(result.success).toBe(true);
    expect(result.sid).toBe("mock_sid_123");
    expect(mockCreate).toHaveBeenCalled();
  });

  test("should handle failure", async () => {
    mockCreate.mockImplementationOnce(() => {
      throw new Error("API failed");
    });

    const result = await sendEmergencyWhatsApp({
      to: "9876543210",
      message: "Emergency alert",
    });

    expect(result.success).toBe(false);
  });
});
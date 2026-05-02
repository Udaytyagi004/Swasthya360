import sendEmergencyWhatsApp from "../tools/whatsappTool.js";

const actionAgent = async (state) => {
  const { severity, symptoms, user, actionTaken, intent, riskAssessment } =
    state;

  if (actionTaken) {
    return state;
  }

  // Normalize symptoms for case-insensitive matching
  const normalizedSymptoms = (symptoms || []).map((s) => s.toLowerCase());

  const isEmergency =
    intent === "emergency" ||
    severity >= 8 ||
    normalizedSymptoms.includes("chest pain") ||
    normalizedSymptoms.includes("shortness of breath") ||
    riskAssessment?.riskLevel === "Emergency";

  console.log(`[Action Agent] Checking emergency. Intent: ${intent}, Severity: ${severity}, Contact: ${user?.emergencyContact}`);

  if (isEmergency) {
    if (!user?.emergencyContact) {
      console.warn(
        "[Action Agent] Emergency detected, but no emergency contact found for user:",
        user?.name || "Unknown",
      );
      console.debug("[Action Agent] Full User Object:", JSON.stringify(user));
      return {
        ...state,
        actionTaken: true,
        alertStatus: "skipped (no contact)",
      };
    }

    const message = `🚨 EMERGENCY ALERT

    ${user.name || "A patient"} may be experiencing severe symptoms.

    Symptoms: ${symptoms.length > 0 ? symptoms.join(", ") : "Not specified"}
    Severity: ${severity}/10
    Reasoning: ${riskAssessment?.reasoning || "AI detected emergency"}

    Please contact them immediately or seek medical help.`;

    console.log(`[Action Agent] Sending emergency WhatsApp to ${user.emergencyContact}`);
    const result = await sendEmergencyWhatsApp({
      to: user.emergencyContact,
      message,
    });

    return {
      ...state,
      actionTaken: true,
      alertStatus: result.success ? "sent" : "failed",
    };
  }

  return state;
};

export default actionAgent;

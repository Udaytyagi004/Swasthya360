const actionAgent = async (state) => {
  let alertSent = false;

  const isEmergencyDiagnosis = state.diagnosis?.isEmergency || false;
  const isHighRisk =
    state.riskAssessment?.riskLevel === "Emergency" ||
    state.riskAssessment?.riskLevel === "High";

  if (isEmergencyDiagnosis || isHighRisk) {
    // notification service call (mocked)
    console.log("sending emergency alert");
    alertSent = true;
  }

  return {
    actionTaken: alertSent,
  };
};

export default actionAgent;

const createInitialState = (input) => {
  return {
    user: input.user || null,
    query: input.query?.trim() || "",
    symptoms: Array.isArray(input.symptoms) ? input.symptoms : [],
    severity: Number(input.severity) || 0,
    duration: input.duration || "Unknown",
    context: input.context || {},
    step: 0,
    plan: [],
  };
};

export default createInitialState;

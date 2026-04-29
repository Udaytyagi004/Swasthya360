const symptomAgent = async (state) => {
  

  
  const activeSymptoms = state.rawSymptoms
    .filter(s => s.selected)
    .map(s => s.name);

  const severity = state.otherInfo.severity;
  const duration = state.otherInfo.duration;
  const location = state.context.location;

  
  const summary = `Patient in ${location} reports: ${activeSymptoms.join(", ")}. 
                   Duration: ${duration}. Severity: ${severity}/10.`;

  return { 
    processedSymptomString: summary
  };
};

export default symptomAgent;
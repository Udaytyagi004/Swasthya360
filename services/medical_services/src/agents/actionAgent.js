const actionAgent = async (state) => {

  
  const isEmergency = state.diagnosis.isEmergency;
  let alertSent = false;

  if (isEmergency) {
    
    // notification service call
    
    
    alertSent = true;
  }

  return { 
    alertSent: alertSent,
  };
};

export default actionAgent;
import { Annotation } from "@langchain/langgraph";


const State = Annotation.Root({
  
  userId: Annotation(),
  rawSymptoms: Annotation(), 
  otherInfo: Annotation(),   
  context: Annotation(),    
  
  
  processedSymptomString: Annotation(), 
  
 
  diagnosis: Annotation({
    reducer: (oldVal, newVal) => newVal, 
    default: () => ({
      disease: "Pending",
      confidence: 0,
      preventiveMeasures: [],
      cure: "Pending",
      isEmergency: false
    })
  }),

  
  alertSent: Annotation({
    reducer: (oldVal, newVal) => newVal,
    default: () => false
  })
});

export default State;
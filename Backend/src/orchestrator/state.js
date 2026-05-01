import { Annotation } from "@langchain/langgraph";

const State = Annotation.Root({
  query: Annotation(),
  symptoms: Annotation({ default: () => [] }),
  severity: Annotation({ default: () => 0 }),
  duration: Annotation({ default: () => "Unknown" }),
  context: Annotation({ default: () => ({}) }),

  intent: Annotation({ reducer: (oldVal, newVal) => newVal }),
  plan: Annotation({ reducer: (oldVal, newVal) => newVal, default: () => [] }),
  step: Annotation({ reducer: (oldVal, newVal) => newVal, default: () => 0 }),
  reasoning: Annotation({ reducer: (oldVal, newVal) => newVal }),

  chatResponse: Annotation({ reducer: (oldVal, newVal) => newVal }),
  diagnosis: Annotation({ reducer: (oldVal, newVal) => newVal }),
  riskAssessment: Annotation({ reducer: (oldVal, newVal) => newVal }),
  actionTaken: Annotation({
    reducer: (oldVal, newVal) => newVal,
    default: () => false,
  }),
});

export default State;

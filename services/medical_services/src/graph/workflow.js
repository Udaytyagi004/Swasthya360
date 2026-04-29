import { StateGraph, START, END } from "@langchain/langgraph";
import { Annotation } from "@langchain/langgraph";
import symptomAgent from "../agents/symptomAgent.js";
import diagnosisAgent from "../agents/diagnosisAgent.js";

const AgentState = Annotation.Root({
  rawSymptoms: Annotation(),
  context: Annotation(),
  otherInfo: Annotation(),
  extractedContext: Annotation(),
  processedSymptomString: Annotation(),
  diagnosis: Annotation(),
  alertSent: Annotation()
});

const workflow = new StateGraph(AgentState)
  .addNode("symptomAgent", symptomAgent)
  .addNode("diagnosisAgent", diagnosisAgent)
  .addEdge(START, "symptomAgent")
  .addEdge("symptomAgent", "diagnosisAgent")
  .addEdge("diagnosisAgent", END);

const medService = workflow.compile();


export default medService;
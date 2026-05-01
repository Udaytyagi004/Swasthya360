import { StateGraph, START } from "@langchain/langgraph";
import State from "./state.js";
import controllerAgent from "./controller.js";
import { routeToNextAgent, incrementStep } from "./guards.js";

import clinicalAgent from "../agents/clinicalAgent.js";
import actionAgent from "../agents/actionAgent.js";
import chatAgent from "../agents/chatAgent.js";

const workflow = new StateGraph(State)

  .addNode("controller", controllerAgent)
  .addNode("clinicalAgent", clinicalAgent)
  .addNode("actionAgent", actionAgent)
  .addNode("chatAgent", chatAgent)
  .addNode("incrementer", incrementStep)
  .addEdge(START, "controller")
  .addConditionalEdges("controller", routeToNextAgent)
  .addEdge("clinicalAgent", "incrementer")
  .addEdge("actionAgent", "incrementer")
  .addEdge("chatAgent", "incrementer")
  .addConditionalEdges("incrementer", routeToNextAgent);

const graph = workflow.compile();

export default graph;

// const workflow = new StateGraph(State)
//   .addNode("controller", controllerAgent)
//   .addNode("clinicalAgent", clinicalAgent)
//   .addNode("actionAgent", actionAgent)
//   .addNode("chatAgent", chatAgent)
//   .addEdge(START, "controller")
//   .addConditionalEdge("controller", "clinicalAgent")
//   .addConditionalEdge("controller", "actionAgent")
//   .addConditionalEdge("controller", "chatAgent")
//   .addConditionalEdge("clinicalAgent", "actionAgent")
//   .addConditionalEdge("clinicalAgent", END)
//   .addConditionalEdge("actionAgent", END)
//   .addConditionalEdge("actionAgent", "chatAgent")
//   .addEdge("chatAgent", END);

import graph from "./graph.js";
import createInitialState from "./state/initState.js";

const executeTriage = async (input) => {
  if (!input || typeof input !== "object") {
    throw new Error(
      "Invalid input: Orchestrator requires a structured input object.",
    );
  }

  const initialState = createInitialState(input);

  console.log(
    `[Orchestrator] Initializing workflow engine for query: "${initialState.query.substring(0, 50)}..."`,
  );
  console.log(
    `[Orchestrator] Input context: Severity=${initialState.severity}, Symptoms=${initialState.symptoms.length}`,
  );

  try {
    const finalState = await graph.invoke(initialState, {});

    if (!finalState.plan || finalState.plan.length === 0) {
      console.warn(
        "[Orchestrator] Workflow completed but no plan was generated.",
      );
    }

    console.log(
      `[Orchestrator] Execution finished successfully. Steps completed: ${finalState.step}`,
    );

    return finalState;
  } catch (error) {
    console.error(
      "[Orchestrator] CRITICAL: Workflow Engine Failure:",
      error.message,
    );
    if (error.stack) {
      console.debug("[Orchestrator] Stack Trace:", error.stack.split("\n")[0]);
    }

    throw new Error(
      `Orchestration Engine failed to process the triage request: ${error.message}`,
    );
  }
};
export default executeTriage;

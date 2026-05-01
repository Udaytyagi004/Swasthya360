import { END } from "@langchain/langgraph";

export const routeToNextAgent = (state) => {
  const { plan, step } = state;

  if (!plan || step >= plan.length) {
    console.log("[Router] Plan complete. Ending workflow.");
    return END;
  }

  const nextAgent = plan[step];
  console.log(
    `[Router] Routing to next agent in plan: ${nextAgent} (Step ${step + 1}/${plan.length})`,
  );
  return nextAgent;
};

export const incrementStep = (state) => {
  return { step: state.step + 1 };
};

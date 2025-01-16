import { taskReadyForCompletion, taskReadyForProgress } from "./conditions.js";

const conditionEvaluator = {
  "in-progress": taskReadyForProgress,
  "completion": taskReadyForCompletion,
};

export const evaluateCondition = (type, ...args) => {
  if (!conditionEvaluator[type]) {
    throw new Error(`Unknown condition type: ${type}`);
  }
  return conditionEvaluator[type](...args);
};

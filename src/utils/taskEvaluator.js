//src/utils/taskEvaluator.js
import { taskReadyForProgress, taskReadyForCompletion } from './conditions.js';

export const evaluateTaskTransition = (
  build,
  componentName,
  taskGroupName,
  taskName,
  newStatus,
  additionalConditions = []
) => {
  const conditions = [];
  console.log(`Evaluating transition for "${taskName}" to "${newStatus}"`);

  if (newStatus === 'in-progress') {
    conditions.push(taskReadyForProgress(componentName, taskGroupName, taskName));
  }

  if (newStatus === 'complete') {
    conditions.push(taskReadyForCompletion(componentName, taskGroupName, taskName));
    if (Array.isArray(additionalConditions)) {
      conditions.push(...additionalConditions);
    }
  }

  // Evaluate all conditions
  const failedConditions = conditions
    .map((condition) => condition(build))
    .filter((result) => !result.success);

  if (failedConditions.length > 0) {
    console.error(`Failed conditions for "${taskName}":`, failedConditions);
    return {
      success: false,
      message: failedConditions.map((c) => c.message).join(' '),
    };
  }

  console.log(`Transition for "${taskName}" to "${newStatus}" successful.`);
  return { success: true, message: '' };
};

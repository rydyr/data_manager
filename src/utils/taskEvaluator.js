import { taskReadyForProgress, taskReadyForCompletion } from './conditions.js';

const conditionMap = {
  'in-progress': taskReadyForProgress,
  'completion': taskReadyForCompletion,
};

export const evaluateTaskTransition = (
  build,
  componentName,
  taskGroupName,
  taskName,
  newStatus,
  additionalConditions = []
) => {
  console.log(`Evaluating transition for "${taskName}" to "${newStatus}"`);

  // Ensure additionalConditions is an array
  if (!Array.isArray(additionalConditions)) {
    console.warn(
      `Expected additionalConditions to be an array, but received: ${typeof additionalConditions}. Defaulting to an empty array.`
    );
    additionalConditions = [];
  }

  const conditions = [];

  if (newStatus === 'in-progress') {
    const progressCondition = taskReadyForProgress(componentName, taskGroupName, taskName);
    if (progressCondition) conditions.push(progressCondition);
  }

  if (newStatus === 'complete') {
    const completionCondition = taskReadyForCompletion(componentName, taskGroupName, taskName);
    if (completionCondition) conditions.push(completionCondition);
    conditions.push(...additionalConditions);
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

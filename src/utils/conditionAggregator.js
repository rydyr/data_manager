// src/utils/conditionAggregator.js
export const evaluateConditions = (build, conditions) => {
  const failedConditions = conditions
    .map((condition) => {
      try {
        return condition(build);
      } catch (error) {
        console.error(`Condition evaluation error: ${error.message}`, error);
        return { success: false, message: 'Error during condition evaluation.' };
      }
    })
    .filter((result) => !result.success);

  return {
    success: failedConditions.length === 0,
    message: failedConditions.map((condition) => condition.message).join(' '),
  };
};

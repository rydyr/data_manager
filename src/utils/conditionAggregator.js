// src/utils/conditionAggregator.js
export const evaluateConditions = (build, conditions) => {
    const failedConditions = conditions
      .map((condition) => condition(build))
      .filter((result) => !result.success);
  
    if (failedConditions.length > 0) {
      return {
        success: false,
        message: failedConditions.map((condition) => condition.message).join(' '),
      };
    }
  
    return { success: true, message: '' };
  };
  
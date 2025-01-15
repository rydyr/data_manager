//src/utils/taskEvaluator.js
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
  
    // Add conditions based on new status
    if (newStatus === 'in-progress') {
      conditions.push((build) => {
        const task = build.components
          .find((c) => c.name === componentName)
          ?.taskGroups.find((g) => g.name === taskGroupName)
          ?.tasks.find((t) => t.name === taskName);
  
        if (!task) {
          return { success: false, message: `Task "${taskName}" not found.` };
        }
  
        return task.status === 'pending'
          ? { success: true, message: '' }
          : { success: false, message: `Task "${taskName}" must start from "pending".` };
      });
    }
  
    if (newStatus === 'complete') {
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
  
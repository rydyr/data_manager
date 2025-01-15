export const evaluateTaskTransition = (
    build,
    componentName,
    taskGroupName,
    taskName,
    newStatus,
    additionalConditions = []
  ) => {
    const conditions = [];
  
    console.log(`Evaluating transition for ${taskName} to ${newStatus}`);
  
    if (newStatus === 'in-progress') {
      conditions.push((build) => {
        const task = build.components
          .find((c) => c.name === componentName)
          ?.taskGroups.find((g) => g.name === taskGroupName)
          ?.tasks.find((t) => t.name === taskName);
  
        if (!task) {
          return { success: false, message: `Task "${taskName}" not found.` };
        }
  
        return task.status === 'complete'
          ? { success: true, message: '' }
          : { success: false, message: `Task "${taskName}" must be marked as complete.` };
      });
    }
  
    if (newStatus === 'complete') {
      // Add additional completion conditions
      if (Array.isArray(additionalConditions)) {
        conditions.push(...additionalConditions);
      }
    }
  
    // Evaluate all conditions
    const failedConditions = conditions
      .map((condition) => condition(build))
      .filter((result) => !result.success);
  
    console.log('Failed conditions:', failedConditions);
  
    if (failedConditions.length > 0) {
      return {
        success: false,
        message: failedConditions.map((c) => c.message).join(' '),
      };
    }
  
    return { success: true, message: '' };
  };
  
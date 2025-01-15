//src/utils/conditions.js
export const taskReadyForProgress = (
  componentName,
  taskGroupName = null,
  taskName = null,
  verbose = false
) => (build) => {
  // Locate the prerequisite component
  const component = build.components.find((c) => c.name === componentName);
  if (!component) {
    return { success: false, message: `"${componentName}" not found.` };
  }

 
  // Check if the component is complete
  if (component.status === 'complete') {
    return { success: true, message: '' };
  }
  return {
    success: false,
    message: `"${componentName}" must be complete before this task can begin.`
  };
  

  // Locate the task group within the prerequisite component
  const taskGroup = component.taskGroups.find((g) => g.name === taskGroupName);
  if (!taskGroup) {
    return {
      success: false,
      message: `"${taskGroupName}" not found in component "${componentName}".`,
    };
  }

  
  // Check if the task group is complete
  if (taskGroup.status === 'complete') {
    return { success: true, message: '' };
  }
  return {
    success: false,
    message: verbose
      ? `Task group "${taskGroupName}" in component "${componentName}" must be complete before this task can begin.`
      : `"${taskGroupName}" must be complete before this task can begin.`,
  };
  

  // Locate the task within the task group
  const task = taskGroup.tasks.find((t) => t.name === taskName);
  if (!task) {
    return {
      success: false,
      message: `Task "${taskName}" not found in task group "${taskGroupName}" of component "${componentName}".`,
    };
  }

 
  // Check if the task is complete
  if (task.status === 'complete') {
    return { success: true, message: '' };
  }
  return {
    success: false,
    message: verbose
      ? `Task "${taskName}" in task group "${taskGroupName}" of component "${componentName}" must be complete before this task can begin.`
      : `"${taskName}" must be complete before this task can begin.`,
  };
  
};



export const taskReadyForCompletion = (componentName, taskGroupName, taskName, fieldCondition = 'optional', specificFields = []) => (build) => {
  // Locate the task
  const task = build.components
    .find((c) => c.name === componentName)
    ?.taskGroups.find((g) => g.name === taskGroupName)
    ?.tasks.find((t) => t.name === taskName);

  if (!task) {
    return { success: false, message: `Task "${taskName}" not found in task group "${taskGroupName}" of component "${componentName}".` };
  }

  // Ensure the task is in-progress
  if (task.status !== 'in-progress') {
    return {
      success: false,
      message: `Task "${taskName}" must be "in-progress" to be marked as complete.`,
    };
  }

  // Determine fields to evaluate
  const fieldsToCheck = specificFields.length
    ? task.formFields.filter((field) => specificFields.includes(field.name))
    : task.formFields;

  // If no specific fields are provided and condition is optional, allow completion
  if (fieldCondition === 'optional' && specificFields.length === 0) {
    return { success: true, message: '' };
  }

  // Check if required fields are complete based on the field condition
  const filledFields = fieldsToCheck.filter((field) => Boolean(field.value));
  const totalFields = fieldsToCheck.length;

  const allFieldsFilled = filledFields.length === totalFields;

  // Evaluate conditions
  if (fieldCondition === 'all' && !allFieldsFilled) {
    return {
      success: false,
      message: `All required fields in task "${taskName}" must be filled before completion.`,
    };
  }

  if (fieldCondition === 'array' && specificFields.length > 0 && filledFields.length !== specificFields.length) {
    return {
      success: false,
      message: `The specified fields in task "${taskName}" must be filled before completion: ${specificFields.join(', ')}.`,
    };
  }

  // Completion allowed
  return { success: true, message: '' };
};

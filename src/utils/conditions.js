//src/utils/conditions.js

export const taskReadyForProgress = (
  componentName,
  taskGroupName = null,
  taskName = null,
  verbose = false
) => (build) => {

  const component = build.components.find((c) => c.name === componentName);
  if (!component) {
    return { success: false, message: `Component "${componentName}" not found.` };
  }


  const taskGroup = taskGroupName
    ? component.taskGroups.find((g) => g.name === taskGroupName)
    : null;


  const task = taskGroup?.tasks.find((t) => t.name === taskName);
  if (!task) {
    return {
      success: false,
      message: `Task "${taskName}" not found in task group "${taskGroupName}" of component "${componentName}".`,
    };
  }

  if (task.completionConditions === null) {
    return { success: true, message: '' };
  }

  const prerequisiteTask = taskGroup?.tasks.find((t) => t.status !== 'complete');
  if (prerequisiteTask) {
    return {
      success: false,
      message: `Task "${prerequisiteTask.name}" must be complete before "${taskName}" can begin.`,
    };
  }

  return {
    success: false,
    message: verbose
      ? `Task "${taskName}" in "${taskGroupName}" of "${componentName}" must wait for prerequisites to be completed.`
      : `"${taskName}" cannot begin yet.`,
  };
};



export const taskReadyForCompletion = (
  componentName,
  taskGroupName,
  taskName,
  fieldCondition = 'optional',
  specificFields = []
) => (build) => {
  const task = build.components
    .find((c) => c.name === componentName)
    ?.taskGroups.find((g) => g.name === taskGroupName)
    ?.tasks.find((t) => t.name === taskName);

  if (!task) {
    return { success: false, message: `Task "${taskName}" not found in "${taskGroupName}" of "${componentName}".` };
  }

  if (task.status !== 'in-progress') {
    return { success: false, message: `Task "${taskName}" must be "in-progress" to complete.` };
  }

  const fieldsToCheck = specificFields.length
    ? task.formFields.filter((field) => specificFields.includes(field.label))
    : task.formFields;

  if (fieldCondition === 'optional' && fieldsToCheck.length === 0) {
    return { success: true, message: '' };
  }

  const filledFields = fieldsToCheck.filter((field) => Boolean(field.value));
  if (fieldCondition === 'all' && filledFields.length !== fieldsToCheck.length) {
    return { success: false, message: `All fields for "${taskName}" must be filled.` };
  }

  if (fieldCondition === 'array' && filledFields.length !== specificFields.length) {
    return { success: false, message: `Specific fields for "${taskName}" must be filled: ${specificFields.join(', ')}.` };
  }

  return { success: true, message: '' };
};

//src/utils/conditions.js

export const taskReadyForProgress = (
  componentName,
  taskGroupName = null,
  taskName = null,
  verbose = true
) => (build) => {
  const component = build.components.find((c) => c.name === componentName);
  if (!component) {
    return { success: false, message: `Component \"${componentName}\" not found.` };
  }

  const taskGroup = taskGroupName
    ? component.taskGroups.find((g) => g.name === taskGroupName)
    : null;

  const task = taskGroup?.tasks.find((t) => t.name === taskName);
  if (!task) {
    return {
      success: false,
      message: `Task \"${taskName}\" not found in task group \"${taskGroupName}\" of component \"${componentName}\".`,
    };
  }

  if (!task.inProgressConditions) {
    return { success: true, message: '' }; 
  }

  // Evaluate inProgressConditions
  const failedConditions = task.inProgressConditions.map((condition) => {
    // Check for component-level conditions
    if (condition.type === 'component') {
      const dependencyComponent = build.components.find((c) => c.name === condition.component);
      if (!dependencyComponent) {
        return { success: false, message: `Component \"${condition.component}\" not found.` };
      }

      if (dependencyComponent.status !== 'complete') {
        if (!task.inProgressConditions.verbose) {
          return { success: false, message: `\"${condition.component}\" not complete.` };
        }
        return { success: false, message: `Component \"${condition.component}\" is not complete.` };
      }

      return { success: true };
    }

    // Check for taskGroup-level conditions
    if (condition.type === 'taskGroup') {
      const dependencyComponent = build.components.find((c) => c.name === condition.component);
      const dependencyTaskGroup = dependencyComponent?.taskGroups.find((g) => g.name === condition.taskGroup);
      if (!dependencyTaskGroup) {
        return { success: false, message: `Task group \"${condition.taskGroup}\" not found in component \"${condition.component}\".` };
      }

      if (dependencyTaskGroup.status !== 'complete') {
        if (!task.inProgressConditions.verbose) {
          return { success: false, message: `\"${condition.taskGroup}\" is not complete.` };
        }
        return { success: false, message: `Task group \"${condition.taskGroup}\" in component \"${condition.component}\" is not complete.` };
      }

      return { success: true };
    }

    // Check for task-level conditions
    if (condition.type === 'task') {
      const dependencyComponent = build.components.find((c) => c.name === condition.component);
      const dependencyTaskGroup = dependencyComponent?.taskGroups.find((g) => g.name === condition.taskGroup);
      const dependencyTask = dependencyTaskGroup?.tasks.find((t) => t.name === condition.task);

      if (!dependencyTask) {
        return { success: false, message: `Task \"${condition.task}\" not found in task group \"${condition.taskGroup}\" of component \"${condition.component}\".` };
      }

      if (dependencyTask.status !== 'complete') {
        if (!task.inProgressConditions.verbose) {
          return { success: false, message: `Task \"${condition.task}\" in task group \"${condition.taskGroup}\" of component \"${condition.component}\" is not complete.` };
        }
        return { success: false, message: `\"${condition.task}\" is not complete.` };
      }

      return { success: true };
    }

    // Unknown condition type
    return { success: false, message: `Unknown condition type \"${condition.type}\".` };
  }).filter((result) => !result.success);

  if (failedConditions.length > 0) {
    return {
      success: false,
      message: failedConditions.map((c) => c.message).join(' '),
    };
  }

  return { success: true, message: '' };
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

//src/utils/conditions.js
export const taskReadyForProgress = (componentName, taskGroupName, taskName) => (build) => {
  const task = build.components
    .find((c) => c.name === componentName)
    ?.taskGroups.find((g) => g.name === taskGroupName)
    ?.tasks.find((t) => t.name === taskName);

  if (!task) {
    return { success: false, message: `Task "${taskName}" not found.` };
  }

  return task.status === 'pending'
    ? { success: true, message: '' }
    : { success: false, message: `Task "${taskName}" must be in "pending" state to start progress.` };
};

export const taskReadyForCompletion = (componentName, taskGroupName, taskName) => (build) => {
  const task = build.components
    .find((c) => c.name === componentName)
    ?.taskGroups.find((g) => g.name === taskGroupName)
    ?.tasks.find((t) => t.name === taskName);

  if (!task) {
    return { success: false, message: `Task "${taskName}" not found.` };
  }

  const allFieldsFilled = task.formFields.every((field) => field.value);
  if (!allFieldsFilled) {
    return { success: false, message: `All fields in task "${taskName}" must be filled before completion.` };
  }

  return task.status === 'in-progress'
    ? { success: true, message: '' }
    : { success: false, message: `Task "${taskName}" must be "in-progress" to be marked as complete.` };
};

// src/utils/conditions.js
export const fieldFilled = (componentName, taskGroupName, taskName, fieldLabel) => (build) => {
    const field = build.components
      .find((c) => c.name === componentName)
      ?.taskGroups.find((g) => g.name === taskGroupName)
      ?.tasks.find((t) => t.name === taskName)
      ?.formFields.find((f) => f.label === fieldLabel);
  
    return field?.value
      ? { success: true, message: '' }
      : { success: false, message: `The "${fieldLabel}" field in task "${taskName}" must be filled out.` };
  };
  
  export const taskComplete = (componentName, taskGroupName, taskName) => (build) => {
    const task = build.components
      .find((c) => c.name === componentName)
      ?.taskGroups.find((g) => g.name === taskGroupName)
      ?.tasks.find((t) => t.name === taskName);
  
    return task?.status === 'complete'
      ? { success: true, message: '' }
      : { success: false, message: `The task "${taskName}" in group "${taskGroupName}" must be complete.` };
  };
  
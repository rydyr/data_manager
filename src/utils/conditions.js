//src/utils/conditions.js

export const taskReadyForProgress = (...params) => (build) => {
  const [componentName, taskGroupName, taskName] = params;
  const { success, task, message } = findTask(build, componentName, taskGroupName, taskName);
  if (!success) return { success: false, message };

  if (task.status !== "pending") {
    return { success: false, message: `Task "${taskName}" must be "pending" to start progress.` };
  }

  return { success: true, message: "" };
};

export const taskReadyForCompletion = (...params) => (build) => {
  const [componentName, taskGroupName, taskName, fieldCondition, specificFields] = params;
  const { success, task, message } = findTask(build, componentName, taskGroupName, taskName);
  if (!success) return { success: false, message };

  if (task.status !== "in-progress") {
    return { success: false, message: `Task "${taskName}" must be "in-progress" to complete.` };
  }

  const fieldsToCheck = specificFields?.length
    ? task.formFields.filter((field) => specificFields.includes(field.label))
    : task.formFields;

  const filledFields = fieldsToCheck.filter((field) => Boolean(field.value));
  const allFieldsFilled = fieldsToCheck.length === filledFields.length;

  if ((fieldCondition === "all" && !allFieldsFilled) || (fieldCondition === "any" && filledFields.length === 0)) {
    return {
      success: false,
      message: `Task "${taskName}" requires ${
        fieldCondition === "all" ? "all" : "at least one"
      } fields to be filled.`,
    };
  }

  return { success: true, message: "" };
};

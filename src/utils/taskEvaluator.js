import { evaluateCondition } from "./conditionEvaluator.js";

const findTask = (build, componentName, taskGroupName, taskName) => {
  const component = build.components.find((c) => c.name === componentName);
  if (!component) return { success: false, message: `Component "${componentName}" not found.` };

  const taskGroup = component.taskGroups.find((g) => g.name === taskGroupName);
  if (!taskGroup) return { success: false, message: `Task group "${taskGroupName}" not found.` };

  const task = taskGroup.tasks.find((t) => t.name === taskName);
  if (!task) return { success: false, message: `Task "${taskName}" not found.` };

  return { success: true, task, component, taskGroup };
};

export const evaluateTaskTransition = (build, componentName, taskGroupName, taskName, newStatus) => {
  console.log(`Evaluating transition for "${taskName}" to "${newStatus}"`);

  const { success, task, message } = findTask(build, componentName, taskGroupName, taskName);
  if (!success) return { success: false, message };

  const conditions = newStatus === "in-progress" ? task.inProgressConditions : task.completionConditions;
  if (!conditions?.length) return { success: true, message: "" };

  const failedConditions = conditions
    .map((condition) => evaluateCondition(condition.type, ...condition.params)(build))
    .filter((result) => !result.success);

  if (failedConditions.length > 0) {
    return {
      success: false,
      message: failedConditions.map((c) => c.message).join(" "),
    };
  }

  return { success: true, message: "" };
};

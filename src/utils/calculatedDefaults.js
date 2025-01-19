export const resolveDefaultValue = (defaultValue) => {
    if (!defaultValue || typeof defaultValue !== 'object') return type === 'checkbox' ? false : '';

    const { type: defaultType, value } = defaultValue;

    switch (defaultType) {
      case 'static':
        return value;
      case 'calc':
        return typeof value === 'function' ? value() : '';
      case 'derived':
        // For derived defaults, defer resolution until context is provided
        return null;
      default:
        console.warn(`Unknown default type: ${defaultType}`);
        return '';
    }
  };

export const resolveDerivedDefault = (build, derivedConfig) => {
  const { component, taskgroup, task, formfield } = derivedConfig;

  // Locate the component
  const targetComponent = build.components.find((c) => c.name === component);
  if (!targetComponent) {
    console.warn(`Component "${component}" not found.`);
    return null;
  }

  // Locate the task group
  const targetTaskGroup = targetComponent.taskGroups.find((tg) => tg.name === taskgroup);
  if (!targetTaskGroup) {
    console.warn(`Task group "${taskgroup}" not found in component "${component}".`);
    return null;
  }

  // Locate the task
  const targetTask = targetTaskGroup.tasks.find((t) => t.name === task);
  if (!targetTask) {
    console.warn(`Task "${task}" not found in task group "${taskgroup}" of component "${component}".`);
    return null;
  }

  // Locate the field
  const targetField = targetTask.formFields.find((f) => f.label === formfield);
  if (!targetField) {
    console.warn(`Field "${formfield}" not found in task "${task}" of task group "${taskgroup}".`);
    return null;
  }

  // Return the current value of the target field
  return targetField.value;
};

  
export const initializeFieldsWithDefaults = (fields, build) => {
  return fields.map((field) => {
    if (field.defaultValue?.type === 'derived') {
      return {
        ...field,
        value: resolveDerivedDefault(build, field.defaultValue.value), // Use the current value of the reference
      };
    }
    return field;
  });
};

export const updateDerivedFields = (formFields, build) => {
  return formFields.map((field) => {
    if (field.defaultValue?.type === 'derived') {
      const newValue = resolveDerivedDefault(build, field.defaultValue.value);
      return { ...field, value: newValue };
    }
    return field;
  });
};


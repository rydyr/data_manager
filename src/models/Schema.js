//src/models/schema.js
import { v4 as uuidv4 } from 'uuid';


const createFormField = (type, label, options = [], readOnlyConditions = null, visibilityConditions = null, testId = null, message = null, messageCondition = null, messageStyle = {}, group = null, groupLabel = null) => {
  const validFieldTypes = ['text', 'number', 'checkbox', 'dropdown'];
  if (!validFieldTypes.includes(type)) {
    throw new Error(`Invalid field type: ${type}`);
  }
  return {
    id: uuidv4(),
    type,
    label,
    value: type === 'checkbox' ? false : '', // Default values
    options,
    readOnlyConditions: readOnlyConditions || null,
    visibilityConditions: visibilityConditions || null,
    testId,
    message,
    messageCondition,
    messageStyle,
    group,
    groupLabel,
  };
};



const createTask = (name, formFields = [], readOnlyConditions = null, visibilityConditions, label = null, testId = null) => ({
  id: uuidv4(),
  name,
  label: label || name,
  status: 'pending', 
  formFields,
  readOnlyConditions: readOnlyConditions || null,
  visibilityConditions: visibilityConditions || null,
  testId,
});



const createTaskGroup = (name, tasks = [], label = null, visibilityConditions = null) => ({
  id: uuidv4(),
  name,
  label: label || name,
  tasks,
  visibilityConditions: visibilityConditions || null, 
  get status() {
    const statuses = tasks.map((task) => task.status);
    if (statuses.every((status) => status === 'complete')) return 'complete';
    if (statuses.some((status) => status === 'in-progress' || status === 'complete')) return 'in-progress';
    return 'pending';
  },
});



const createComponent = (name, formFields = [], taskGroups = [], visibilityConditions, label = null, testId = null) => ({
  id: uuidv4(),
  name,
  label: label || name,
  formFields,
  taskGroups,
  get status() {
    const statuses = taskGroups.map((group) => group.status);
    if (statuses.every((status) => status === 'complete')) return 'complete';
    if (statuses.some((status) => status === 'in-progress' || status === 'complete')) return 'in-progress';
    return 'pending';
  },
  visibilityConditions: visibilityConditions || null, 
  testId,
});



const createBuild = (name, formFields = [], components = [], label = null, testId = null) => ({
  id: uuidv4(),
  name,
  label: label || name,
  formFields,
  components,
  get status() {
    if (this.components?.length === 0) return 'pending'; 
    const allStatuses = this.components.map((component) => component.status);
    if (allStatuses.every((status) => status === 'complete')) return 'complete';
    if (allStatuses.some((status) => status === 'in-progress' || status === 'complete')) return 'in-progress';
    return 'pending';
  },
  testId,
});



export {
  createTask,
  createTaskGroup,
  createComponent,
  createBuild,
  createFormField,
};
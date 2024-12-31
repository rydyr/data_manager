// tests/Schema.test.js
import {
  createBuild,
  createComponent,
  createTaskGroup,
  createTask,
  createFormField,
} from '../src/models/Schema.js';

describe('Schema Factories', () => {
  test('createBuild generates a valid build object', () => {
    const build = createBuild('Test Build');

    expect(build).toMatchObject({
      name: 'Test Build',
      components: [],
    });
    expect(build.status).toBe('pending'); // Default status
  });

  test('createComponent generates a valid component object', () => {
    const component = createComponent('Test Component');

    expect(component).toMatchObject({
      name: 'Test Component',
      taskGroups: [],
    });
    expect(component.status).toBe('pending'); // Default status
  });

  test('createTaskGroup generates a valid task group object', () => {
    const taskGroup = createTaskGroup('Test Task Group');

    expect(taskGroup).toMatchObject({
      name: 'Test Task Group',
      tasks: [],
    });
    expect(taskGroup.status).toBe('pending'); // Default status
  });

  test('createTask generates a valid task object', () => {
    const task = createTask('Test Task');

    expect(task).toMatchObject({
      name: 'Test Task',
      status: 'pending',
      formFields: [],
    });
  });

  test('createFormField generates a valid form field object', () => {
    const formField = createFormField('text', 'Sample Label');

    expect(formField).toMatchObject({
      type: 'text',
      label: 'Sample Label',
      value: '',
    });
  });

  test('createFormField handles different field types', () => {
    const textField = createFormField('text', 'Text Label');
    const numberField = createFormField('number', 'Number Label');
    const checkboxField = createFormField('checkbox', 'Checkbox Label');
    const dropdownField = createFormField('dropdown', 'Dropdown Label', ['Option 1', 'Option 2']);

    expect(textField.value).toBe('');
    expect(numberField.value).toBe('');
    expect(checkboxField.value).toBe(false); // Default value for checkboxes
    expect(dropdownField.options).toEqual(['Option 1', 'Option 2']);
  });

  test('createFormField sets visibility conditions correctly', () => {
    const mockVisibilityCondition = jest.fn(() => true);
    const fieldWithCondition = createFormField('text', 'Conditioned Field', [], mockVisibilityCondition);

    expect(fieldWithCondition.visibilityConditions).toBe(mockVisibilityCondition);
  });
});

describe('Schema Dynamic Status Calculations', () => {
  test('Task group calculates status correctly', () => {
    const taskGroup = createTaskGroup('Task Group', [
      createTask('Task 1', [], null, null, 'complete'),
      createTask('Task 2', [], null, null, 'in-progress'),
    ]);
  
    expect(taskGroup.status).toBe('in-progress'); // Derived from child statuses
  });

  test('Component calculates status correctly', () => {
    const component = createComponent('Component', [
      createTaskGroup('Task Group 1', [createTask('Task 1', [], null, null, 'complete')]),
      createTaskGroup('Task Group 2', [createTask('Task 2', [], null, null, 'pending')]),
    ]);

    expect(component.status).toBe('in-progress'); // Derived from child task groups
  });

  test('Build calculates status correctly', () => {
    const build = createBuild('Build', [
      createComponent('Component 1', [createTaskGroup('Task Group 1', [createTask('Task 1', [], null, null, 'complete')])]),
      createComponent('Component 2', [createTaskGroup('Task Group 2', [createTask('Task 2', [], null, null, 'pending')])]),
    ]);

    expect(build.status).toBe('in-progress'); // Derived from child components
  });
});

describe('Schema Error Handling', () => {
  test('createFormField throws error for invalid field type', () => {
    expect(() => createFormField('invalid', 'Invalid Field')).toThrow();
  });

  test('createTask handles missing parameters gracefully', () => {
    const task = createTask('Test Task');
    expect(task.name).toBe('Test Task');
    expect(task.formFields).toEqual([]);
  });

  test('createComponent handles missing parameters gracefully', () => {
    const component = createComponent('Test Component');
    expect(component.name).toBe('Test Component');
    expect(component.taskGroups).toEqual([]);
  });

  test('createBuild handles missing parameters gracefully', () => {
    const build = createBuild('Test Build');
    expect(build.name).toBe('Test Build');
    expect(build.components).toEqual([]);
  });
});

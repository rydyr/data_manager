// src/models/testBuild.js
import { createBuild, createComponent, createTaskGroup, createTask, createFormField } from './Schema.js';

export const testBuild = createBuild('Test Build', [
    createComponent('Test Component', [
      createTaskGroup('Test Task Group', [
        createTask(
          'Test Task 1',
          [
            createFormField('text', 'Test Text Field 1'),
            createFormField('checkbox', 'Test Checkbox 1'),
          ],
          null, // No read-only condition for simplicity
          () => true // Always visible for testing
        ),
        createTask(
          'Test Task 2',
          [
            createFormField('number', 'Test Number Field 2',null,(build) => build.status === "pending"),
            createFormField('dropdown', 'Test Dropdown 2', ['Option A', 'Option B']),
          ],
          null,
          () => true // Always visible for testing
        ),
      ]),
    ]),
  ]);
  
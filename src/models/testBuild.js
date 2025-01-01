//src/models/testBuild.js
import {
  createBuild,
  createComponent,
  createTaskGroup,
  createTask,
  createFormField,
} from './Schema.js';

export const testBuild = createBuild(
  'Test Build',
  [
    // Build-level form fields
    createFormField('text', 'Build Status Note', [], null, () => true, 'build-status-note'),
  ],
  [
    // Component A
    createComponent(
      'Component A',
      [createFormField('number', 'Component A Priority', [], null, () => true, 'component-a-priority')],
      [
        // Task Group A1
        createTaskGroup(
          'Task Group A1',
          [
            createTask(
              'Task A1.1',
              [
                createFormField('text', 'Task A1.1 Note', [], null, () => true, 'task-a1-1-note'),
                createFormField('checkbox', 'Task A1.1 Complete', [], null, () => true, 'task-a1-1-complete'),
              ],
              null,
              //(build) => build.status !== 'pending', // Visible if build status is not pending
              (build) => true,
              'task-a1-1'
            ),
            createTask(
              'Task A1.2',
              [
                createFormField(
                  'dropdown',
                  'Task A1.2 Status',
                  ['Not Started', 'In Progress', 'Completed'],
                  null,
                  (build) => true,
                  'task-a1-2-status'
                ),
              ],
              null,
              //(build) => build.components.some((comp) => comp.status === 'in-progress'), // Visible if any component is in progress
              (build) => true,
              'task-a1-2'
            ),
          ],
          (build) => true, // Task group always visible
          'task-group-a1'
        ),
      ],
      (build) => true, // Component always visible
      'component-a'
    ),
    // Component B
    createComponent(
      'Component B',
      [],
      [
        // Task Group B1
        createTaskGroup(
          'Task Group B1',
          [
            createTask(
              'Task B1.1',
              [
                createFormField('text', 'Task B1.1 Description', [], null, () => true, 'task-b1-1-description'),
              ],
              (build) => build.status === 'complete', // Read-only if build status is complete
              (build) => true, // Always visible
              'task-b1-1'
            ),
            createTask(
              'Task B1.2',
              [],
              null,
              (build) => build.status !== 'complete', // Not visible if build status is complete
              'task-b1-2'
            ),
          ],
          (build) => true, // Task group always visible
          'task-group-b1'
        ),
      ],
      (build) => true, // Component always visible
      'component-b'
    ),
    // Component C
    createComponent(
      'Component C',
      [],
      [
        // Task Group C1
        createTaskGroup(
          'Task Group C1',
          [
            createTask(
              'Task C1.1',
              [],
              null,
              (build) =>
                build.components.some(
                  (comp) => comp.name === 'Component B' && comp.status === 'complete'
                ), // Visible if Component B is complete
              'task-c1-1'
            ),
            createTask(
              'Task C1.2',
              [
                createFormField('number', 'Task C1.2 Progress', [], null, () => true, 'task-c1-2-progress'),
              ],
              (build) =>
                build.tasks.some((task) => task.name === 'Task A1.1' && task.status === 'complete'), // Read-only if Task A1.1 is complete
              (build) => build.status === 'in-progress', // Visible if build status is in-progress
              'task-c1-2'
            ),
          ],
          (build) => true, // Task group always visible
          'task-group-c1'
        ),
      ],
      (build) => true, // Component always visible
      'component-c'
    ),
  ]
);

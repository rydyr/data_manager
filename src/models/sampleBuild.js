// src/models/sampleBuild.js
import { createBuild, createComponent, createTaskGroup, createTask, createFormField } from '../utils/Schema.js';

export const sampleBuild = createBuild('Demo Build', [
  createFormField('text', 'Provide Build Description', [],null,null,null,null,null,null,'one','demo fields', null, (build) => build.status !== "pending"),
  createFormField('number', 'Estimated Completion Time (Days)',[],null,null,null,null,null,null,'one','demo fields', null, (build) => build.status !== "pending"),
], [
  createComponent(
    'Component A',
    [
      createFormField('dropdown', 'Component Priority', ['Low', 'Medium', 'High']),
    ],
    [
      createTaskGroup(
        'Task Group A1',
        [
          createTask(
            'Task A1.1',
            [
              createFormField('text', 'Name This Task',[],null,null,null,'message',() => true,{color: 'blue'}),
              createFormField('checkbox', 'Is Task A1.1 Completed?'),
            ],
            null, // No read-only condition
            (build) => build.status !== 'pending' // Visible once the build status is updated
          ),
          createTask(
            'Task A1.2',
            [
              createFormField('number', 'Enter hours for Task A1.2'),
            ],
            null, // No read-only condition
            (build) =>
              build.components.find((c) => c.name === 'Component B')?.status ===
              'in-progress' // Visible when Component B is in-progress
          ),
        ]
      ),
      createTaskGroup(
        'Task Group A2',
        [
          createTask(
            'Task A2.1',
            [
              createFormField('dropdown', 'Priority Level for Task A2.1', ['Low', 'Medium', 'High']),
            ]
          ),
        ]
      ),
    ]
  ),
  createComponent(
    'Component B',
    [],
    [
      createTaskGroup(
        'Task Group B1',
        [
          createTask(
            'Task B1.1',
            [
              createFormField('dropdown', 'Choose an option', ['Option 1', 'Option 2']),
            ],
            (build) => build.status === 'complete', // Read-only when build is complete
            null // Always visible
          ),
          createTask(
            'Task B1.2',
            [
              createFormField('text', 'Details for Task B1.2'),
            ],
            null, // No read-only condition
            (build) => build.status !== 'complete' // Hidden if the build is complete
          ),
        ]
      ),
      createTaskGroup(
        'Task Group B2',
        [
          createTask(
            'Task B2.1',
            [
              createFormField('text', 'Notes for Task B2.1'),
              createFormField('checkbox', 'Mark Task B2.1 Complete'),
            ]
          ),
        ]
      ),
      createTaskGroup(
        'Task Group B3',
        [
          createTask(
            'Task B3.1',
            [
              createFormField('number', 'Estimated Effort (Hours)'),
            ]
          ),
          createTask(
            'Task B3.2',
            [
              createFormField('text', 'Add Details for Task B3.2'),
            ]
          ),
          createTask(
            'Task B3.3',
            [
              createFormField('checkbox', 'Is Task B3.3 Approved?'),
            ]
          ),
        ]
      ),
    ]
  ),
  createComponent(
    'Component C',
    [
      createFormField('text', 'Component Description'),
    ],
    [
      createTaskGroup(
        'Task Group C1',
        [
          createTask(
            'Task C1.1',
            [
              createFormField('checkbox', 'Mark Task C1.1 as done'),
            ],
            null, // No read-only condition
            (build) => {
              const componentBStatus = build.components.find(
                (c) => c.name === 'Component B'
              )?.status;
              return componentBStatus === 'complete'; // Visible when Component B is complete
            }
          ),
          createTask(
            'Task C1.2',
            [
              createFormField('text', 'Additional notes for Task C1.2'),
            ],
            (build) => {
              const taskA1_1 = build.components
                .find((c) => c.name === 'Component A')
                ?.taskGroups[0]?.tasks.find((t) => t.name === 'Task A1.1');
              return taskA1_1?.status === 'complete'; // Read-only when Task A1.1 is complete
            },
            (build) => build.status === 'in-progress' // Visible when the build is in-progress
          ),
        ]
      ),
      createTaskGroup(
        'Task Group C2',
        [
          createTask(
            'Task C2.1',
            [
              createFormField('dropdown', 'Select Task Type', ['Bug Fix', 'Feature', 'Refactor']),
            ]
          ),
        ]
      ),
    ]
  ),
  createComponent(
    'Component D',
    [
      createFormField('number', 'Number of Team Members'),
    ],
    [
      createTaskGroup(
        'Task Group D1',
        [
          createTask(
            'Task D1.1',
            [
              createFormField('text', 'Write Summary for Task D1.1'),
            ]
          ),
          createTask(
            'Task D1.2',
            [
              createFormField('number', 'Estimated Hours for Task D1.2'),
            ]
          ),
        ]
      ),
    ]
  ),
]);

// end of file

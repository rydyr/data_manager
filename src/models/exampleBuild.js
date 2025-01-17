import {
  createBuild,
  createComponent,
  createTaskGroup,
  createTask,
  createFormField,
} from '../utils/Schema.js';

export const exampleBuild = createBuild(
  'Pencil Build',
  [
    // Build-level fields
    createFormField('text', 'Project Name'),
    createFormField('dropdown', 'Priority Level', ['High', 'Medium', 'Low']),
    createFormField('text', 'Client Name'),
    createFormField('number', 'Estimated Completion Time (days)'),
    createFormField('checkbox', 'Rush Order?'),
  ],
  [
    // Barrel Component
    createComponent(
      'Barrel',
      [
        createFormField('dropdown', 'Barrel Material', ['Wood', 'Plastic', 'Composite']),
        createFormField('text', 'Barrel Notes'),
        createFormField('number', 'Barrel Length (cm)'),
      ],
      [
        createTaskGroup(
          'Material Preparation',
          [
            createTask(
              'Select Barrel Material',
              [],
              null, // No read-only conditions
              null, // No visibility conditions
              null, // No in-progress conditions
              null  // No completion conditions
            ),
            createTask(
              'Inspect Material',
              [createFormField('text', 'Inspector Name')],
              null, // No read-only conditions
              null, // No visibility conditions
              [
                { type: 'task', component: 'Barrel', taskGroup: 'Material Preparation', task: 'Select Barrel Material' },
              ]
            ),
            createTask(
              'Cut Material',
              [createFormField('number', 'Length to Cut (cm)')],
              null,
              null,
              [
                { type: 'task', component: 'Barrel', taskGroup: 'Material Preparation', task: 'Inspect Material' },
              ]
            ),
          ]
        ),
        createTaskGroup(
          'Barrel Assembly',
          [
            createTask(
              'Sand Barrel Edges',
              [createFormField('checkbox', 'Edges Smooth?')],
              null,
              null,
              [
                { type: 'task', component: 'Barrel', taskGroup: 'Material Preparation', task: 'Cut Material' },
              ]
            ),
            createTask(
              'Assemble Barrel',
              [createFormField('text', 'Assembly Notes')],
              null,
              null,
              [
                { type: 'task', component: 'Barrel', taskGroup: 'Barrel Assembly', task: 'Sand Barrel Edges' },
              ],
              [
                { type: 'taskGroup', component: 'Barrel', taskGroup: 'Barrel Assembly' },
              ]
            ),
            createTask(
              'Quality Check',
              [
                createFormField('text', 'Quality Assurance Officer'),
                createFormField('checkbox', 'Approved?'),
              ],
              null,
              null,
              [
                { type: 'task', component: 'Barrel', taskGroup: 'Barrel Assembly', task: 'Assemble Barrel' },
              ]
            ),
          ]
        ),
      ]
    ),
    // Core Component
    createComponent(
      'Core',
      [
        createFormField('dropdown', 'Core Type', ['Graphite', 'Lead', 'Charcoal']),
        createFormField('number', 'Core Diameter (mm)'),
        createFormField('number', 'Core Length (cm)'),
      ],
      [
        createTaskGroup(
          'Core Production',
          [
            createTask(
              'Mix Materials',
              [createFormField('text', 'Material Mix Notes')]
            ),
            createTask(
              'Mold Core',
              [createFormField('text', 'Mold Technician Name')],
              null,
              null,
              [
                { type: 'task', component: 'Core', taskGroup: 'Core Production', task: 'Mix Materials' },
              ]
            ),
            createTask(
              'Refine Core',
              [createFormField('number', 'Refinement Time (minutes)')],
              null,
              null,
              [
                { type: 'task', component: 'Core', taskGroup: 'Core Production', task: 'Mold Core' },
              ]
            ),
          ]
        ),
        createTaskGroup(
          'Core Testing',
          [
            createTask(
              'Stress Test',
              [
                createFormField('text', 'Tester Name'),
                createFormField('number', 'Test Pressure (kg/cm²)'),
              ]
            ),
            createTask(
              'Finalize Core',
              [createFormField('checkbox', 'Core Approved')],
              null,
              null,
              [
                { type: 'task', component: 'Core', taskGroup: 'Core Testing', task: 'Stress Test' },
              ]
            ),
          ]
        ),
      ]
    ),
    // Eraser Component
    createComponent(
      'Eraser',
      [
        createFormField('dropdown', 'Eraser Material', ['Rubber', 'Vinyl']),
        createFormField('text', 'Eraser Customization Notes'),
        createFormField('checkbox', 'Eraser Tested?'),
      ],
      [
        createTaskGroup(
          'Eraser Production',
          [
            createTask(
              'Cut Eraser Shape',
              [createFormField('dropdown', 'Shape', ['Round', 'Square', 'Custom'])]
            ),
            createTask(
              'Color Eraser',
              [createFormField('dropdown', 'Color', ['Pink', 'White', 'Blue'])],
              null,
              null,
              [
                { type: 'task', component: 'Eraser', taskGroup: 'Eraser Production', task: 'Cut Eraser Shape' },
              ]
            ),
          ]
        ),
      ]
    ),
    // Paint Component
    createComponent(
      'Paint',
      [
        createFormField('dropdown', 'Paint Type', ['Glossy', 'Matte']),
        createFormField('text', 'Custom Paint Notes'),
      ],
      [
        createTaskGroup(
          'Paint Application',
          [
            createTask('Prime Surface', []),
            createTask(
              'Apply Paint',
              [createFormField('dropdown', 'Color', ['Yellow', 'Red', 'Green', 'Blue'])],
              null,
              null,
              [
                { type: 'task', component: 'Barrel', taskGroup: 'Barrel Assembly', task: 'Quality Check' },
              ]
            ),
          ]
        ),
      ]
    ),
  ]
);

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
              null,
              null,
              null, // No conditions for in-progress
              null, // No conditions for completion
            ),
            createTask(
              'Inspect Material',
              [createFormField('text', 'Inspector Name')],
              { type: 'in-progress', params: ['Barrel', 'Material Preparation', 'Select Barrel Material'] },
              null, // No conditions for completion
            ),
            createTask(
              'Cut Material',
              [createFormField('number', 'Length to Cut (cm)')],
              { type: 'in-progress', params: ['Barrel', 'Material Preparation', 'Inspect Material'] },
              null, // No conditions for completion
            ),
          ]
        ),
        createTaskGroup(
          'Barrel Assembly',
          [
            createTask(
              'Sand Barrel Edges',
              [createFormField('checkbox', 'Edges Smooth?')],
              { type: 'in-progress', params: ['Barrel', 'Material Preparation', 'Cut Material'] },
              null, // No conditions for completion
            ),
            createTask(
              'Assemble Barrel',
              [createFormField('text', 'Assembly Notes')],
              { type: 'in-progress', params: ['Barrel', 'Barrel Assembly', 'Sand Barrel Edges'] },
              { type: 'completion', params: ['Barrel', 'Barrel Assembly', 'Assemble Barrel', 'all'] },
            ),
            createTask(
              'Quality Check',
              [
                createFormField('text', 'Quality Assurance Officer'),
                createFormField('checkbox', 'Approved?'),
              ],
              { type: 'in-progress', params: ['Barrel', 'Barrel Assembly', 'Assemble Barrel'] },
              null, // No conditions for completion
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
            createTask('Mix Materials', [createFormField('text', 'Material Mix Notes')]),
            createTask(
              'Mold Core',
              [createFormField('text', 'Mold Technician Name')],
              { type: 'in-progress', params: ['Core', 'Core Production', 'Mix Materials'] },
            ),
            createTask(
              'Refine Core',
              [createFormField('number', 'Refinement Time (minutes)')],
              { type: 'in-progress', params: ['Core', 'Core Production', 'Mold Core'] },
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
              { type: 'in-progress', params: ['Core', 'Core Testing', 'Stress Test'] },
              { type: 'completion', params: ['Core', 'Core Testing', 'Finalize Core', 'array', ['Core Approved']] },
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
              [createFormField('dropdown', 'Shape', ['Round', 'Square', 'Custom'])],
            ),
            createTask(
              'Color Eraser',
              [createFormField('dropdown', 'Color', ['Pink', 'White', 'Blue'])],
              { type: 'in-progress', params: ['Eraser', 'Eraser Production', 'Cut Eraser Shape'] },
            ),
          ]
        ),
        createTaskGroup(
          'Attachment Process',
          [
            createTask(
              'Attach Eraser',
              [],
              { type: 'in-progress', params: ['Core', 'Core Production', 'Refine Core'] },
            ),
            createTask(
              'Final Eraser Test',
              [
                createFormField('text', 'Tester Name'),
                createFormField('checkbox', 'Passed Test?'),
              ],
              { type: 'in-progress', params: ['Eraser', 'Attachment Process', 'Attach Eraser'] },
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
              { type: 'in-progress', params: ['Barrel', 'Barrel Assembly', 'Quality Check'] },
              { type: 'completion', params: ['Paint', 'Paint Application', 'Apply Paint', 'all'] },
            ),
            createTask(
              'Dry Paint',
              [createFormField('number', 'Drying Time (hours)')],
              { type: 'in-progress', params: ['Paint', 'Paint Application', 'Apply Paint'] },
            ),
          ]
        ),
        createTaskGroup(
          'Paint Inspection',
          [
            createTask('Inspect Paint Finish', [createFormField('checkbox', 'Finish Approved')]),
            createTask(
              'Apply Clear Coat',
              [],
              { type: 'in-progress', params: ['Paint', 'Paint Inspection', 'Inspect Paint Finish'] },
            ),
          ]
        ),
      ]
    ),
  ]
);

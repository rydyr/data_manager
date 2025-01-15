// src/models/exampleBuild.js
import { createBuild, createComponent, createTaskGroup, createTask, createFormField } from '../utils/Schema.js';
import { evaluateConditions } from '../utils/conditionAggregator.js';
import { taskComplete, fieldFilled } from '../utils/conditions.js';

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
            createTask('Select Barrel Material', []),
            createTask('Inspect Material', [createFormField('text', 'Inspector Name')]),
            createTask(
              'Cut Material',
              [createFormField('number', 'Length to Cut (cm)')],
              null,
              null,
              (build) =>
                evaluateConditions(build, [
                  taskComplete('Barrel', 'Material Preparation', 'Inspect Material'),
                ])
            ),
          ]
        ),
        createTaskGroup(
          'Barrel Assembly',
          [
            createTask('Sand Barrel Edges', [createFormField('checkbox', 'Edges Smooth?')]),
            createTask(
              'Assemble Barrel',
              [createFormField('text', 'Assembly Notes')],
              null,
              null,
              (build) =>
                evaluateConditions(build, [
                  taskComplete('Barrel', 'Material Preparation', 'Cut Material'),
                  fieldFilled('Barrel', 'Barrel Assembly', 'Assemble Barrel', 'Assembly Notes'),
                ])
            ),
            createTask('Quality Check', [
              createFormField('text', 'Quality Assurance Officer'),
              createFormField('checkbox', 'Approved?'),
            ]),
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
            createTask('Mold Core', [createFormField('text', 'Mold Technician Name')]),
            createTask(
              'Refine Core',
              [createFormField('number', 'Refinement Time (minutes)')],
              null,
              null,
              (build) =>
                evaluateConditions(build, [
                  taskComplete('Core', 'Core Production', 'Mold Core'),
                ])
            ),
          ]
        ),
        createTaskGroup(
          'Core Testing',
          [
            createTask('Stress Test', [
              createFormField('text', 'Tester Name'),
              createFormField('number', 'Test Pressure (kg/cm²)'),
            ]),
            createTask(
              'Finalize Core',
              [createFormField('checkbox', 'Core Approved')],
              null,
              null,
              (build) =>
                evaluateConditions(build, [
                  taskComplete('Core', 'Core Testing', 'Stress Test'),
                  fieldFilled('Core', 'Core Testing', 'Finalize Core', 'Core Approved'),
                ])
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
            createTask('Cut Eraser Shape', [createFormField('dropdown', 'Shape', ['Round', 'Square', 'Custom'])]),
            createTask('Color Eraser', [createFormField('dropdown', 'Color', ['Pink', 'White', 'Blue'])]),
          ]
        ),
        createTaskGroup(
          'Attachment Process',
          [
            createTask(
              'Attach Eraser',
              [],
              null,
              null,
              (build) =>
                evaluateConditions(build, [
                  taskComplete('Core', 'Core Production', 'Refine Core'),
                ])
            ),
            createTask('Final Eraser Test', [
              createFormField('text', 'Tester Name'),
              createFormField('checkbox', 'Passed Test?'),
            ]),
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
              (build) =>
                evaluateConditions(build, [
                  taskComplete('Barrel', 'Barrel Assembly', 'Quality Check'),
                  fieldFilled('Paint', 'Paint Application', 'Apply Paint', 'Color'),
                ])
            ),
            createTask('Dry Paint', [createFormField('number', 'Drying Time (hours)')]),
          ]
        ),
        createTaskGroup(
          'Paint Inspection',
          [
            createTask('Inspect Paint Finish', [createFormField('checkbox', 'Finish Approved')]),
            createTask('Apply Clear Coat', [], null, null, (build) =>
              evaluateConditions(build, [
                taskComplete('Paint', 'Paint Inspection', 'Inspect Paint Finish'),
              ])
            ),
          ]
        ),
      ]
    ),
  ]
);

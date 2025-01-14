// src/models/exampleBuild.js
import { createBuild, createComponent, createTaskGroup, createTask, createFormField } from './Schema.js';

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
            createTask('Cut Material', [
                createFormField('number', 'Length to Cut (cm)')
            ],
            null,
            null,
            (build) => build.components
                .find(c => c.name === 'Barrel')
                .taskGroups.find(g => g.name === 'Material Preparation')
                .tasks.find(t => t.name === 'Inspect Material').status === 'complete'
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
                build.components
                  .find(c => c.name === 'Barrel')
                  .taskGroups.find(g => g.name === 'Material Preparation')
                  .tasks.find(t => t.name === 'Cut Material').status === 'complete'
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
                build.components
                  .find(c => c.name === 'Core')
                  .taskGroups.find(g => g.name === 'Core Production')
                  .tasks.find(t => t.name === 'Mold Core').status === 'complete'
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
                build.components
                  .find(c => c.name === 'Core')
                  .taskGroups.find(g => g.name === 'Core Testing')
                  .tasks.find(t => t.name === 'Stress Test').status === 'complete'
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
                build.components.find(c => c.name === 'Core').status === 'complete'
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
                build.components
                  .find(c => c.name === 'Barrel')
                  .taskGroups.find(g => g.name === 'Barrel Assembly')
                  .tasks.find(t => t.name === 'Quality Check').status === 'complete'
            ),
            createTask('Dry Paint', [createFormField('number', 'Drying Time (hours)')]),
          ]
        ),
        createTaskGroup(
          'Paint Inspection',
          [
            createTask('Inspect Paint Finish', [createFormField('checkbox', 'Finish Approved')]),
            createTask('Apply Clear Coat', [], null, null, (build) =>
              build.components
                .find(c => c.name === 'Paint')
                .taskGroups.find(g => g.name === 'Paint Inspection')
                .tasks.find(t => t.name === 'Inspect Paint Finish').status === 'complete'
            ),
          ]
        ),
      ]
    ),
  ]
);

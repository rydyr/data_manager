// src/models/exampleBuild.js
import { 
  createBuild, 
  createComponent, 
  createTaskGroup, 
  createTask, 
  createFormField 
} from '../utils/Schema.js';

import { 
  taskReadyForCompletion, 
  taskReadyForProgress 
} from '../utils/conditions.js';

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
            createTask(
              'Inspect Material',
              [createFormField('text', 'Inspector Name')],
              {
                inProgressConditions: [
                  taskReadyForProgress('Barrel', 'Material Preparation', 'Select Barrel Material'),
                ],
              }
            ),
            createTask(
              'Cut Material',
              [createFormField('number', 'Length to Cut (cm)')],
              {
                inProgressConditions: [
                  taskReadyForProgress('Barrel', 'Material Preparation', 'Inspect Material'),
                ],
              }
            ),
          ]
        ),
        createTaskGroup(
          'Barrel Assembly',
          [
            createTask(
              'Sand Barrel Edges',
              [createFormField('checkbox', 'Edges Smooth?')],
              {
                inProgressConditions: [
                  taskReadyForProgress('Barrel', 'Material Preparation', 'Cut Material'),
                ],
              }
            ),
            createTask(
              'Assemble Barrel',
              [createFormField('text', 'Assembly Notes')],
              {
                inProgressConditions: [
                  taskReadyForProgress('Barrel', 'Barrel Assembly', 'Sand Barrel Edges'),
                ],
                completionConditions: [
                  taskReadyForCompletion('Barrel', 'Barrel Assembly', 'Assemble Barrel'),
                ],
              }
            ),
            createTask(
              'Quality Check',
              [
                createFormField('text', 'Quality Assurance Officer'),
                createFormField('checkbox', 'Approved?'),
              ],
              {
                inProgressConditions: [
                  taskReadyForProgress('Barrel', 'Barrel Assembly', 'Assemble Barrel'),
                ],
              }
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
              {
                inProgressConditions: [
                  taskReadyForProgress('Core', 'Core Production', 'Mix Materials'),
                ],
              }
            ),
            createTask(
              'Refine Core',
              [createFormField('number', 'Refinement Time (minutes)')],
              {
                inProgressConditions: [
                  taskReadyForProgress('Core', 'Core Production', 'Mold Core'),
                ],
              }
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
              {
                inProgressConditions: [
                  taskReadyForProgress('Core', 'Core Testing', 'Stress Test'),
                ],
                completionConditions: [
                  taskReadyForCompletion('Core', 'Core Testing', 'Finalize Core'),
                ],
              }
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
            createTask(
              'Color Eraser',
              [createFormField('dropdown', 'Color', ['Pink', 'White', 'Blue'])],
              {
                inProgressConditions: [
                  taskReadyForProgress('Eraser', 'Eraser Production', 'Cut Eraser Shape'),
                ],
              }
            ),
          ]
        ),
        createTaskGroup(
          'Attachment Process',
          [
            createTask(
              'Attach Eraser',
              [],
              {
                inProgressConditions: [
                  taskReadyForProgress('Core', 'Core Production', 'Refine Core'),
                ],
              }
            ),
            createTask(
              'Final Eraser Test',
              [
                createFormField('text', 'Tester Name'),
                createFormField('checkbox', 'Passed Test?'),
              ],
              {
                inProgressConditions: [
                  taskReadyForProgress('Eraser', 'Attachment Process', 'Attach Eraser'),
                ],
              }
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
              {
                inProgressConditions: [
                  taskReadyForProgress('Barrel', 'Barrel Assembly', 'Quality Check'),
                ],
                completionConditions: [
                  taskReadyForCompletion('Paint', 'Paint Application', 'Apply Paint'),
                ],
              }
            ),
            createTask(
              'Dry Paint',
              [createFormField('number', 'Drying Time (hours)')],
              {
                inProgressConditions: [
                  taskReadyForProgress('Paint', 'Paint Application', 'Apply Paint'),
                ],
              }
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
              {
                inProgressConditions: [
                  taskReadyForProgress('Paint', 'Paint Inspection', 'Inspect Paint Finish'),
                ],
              }
            ),
          ]
        ),
      ]
    ),
  ]
);

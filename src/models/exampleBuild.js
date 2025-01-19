// src/models/exampleBuild.js
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
    createFormField('text', 'Project Name', [], null, null, null, null, null, {}, null, null, null, null, true),
    createFormField('dropdown', 'Priority Level', ['High', 'Medium', 'Low'], null, null, null, null, null, {}, null, null, null, null, true),
    createFormField('text', 'Client Name', [], null, null, null, null, null, {}, null, null, null, null, true),
    createFormField('number', 'Estimated Completion Time (days)', [], null, null, null, null, null, {}, null, null, null, null, true),
    createFormField('checkbox', 'Rush Order?', [], null, null, null, null, null, {}, null, null, null, null),
  ],
  [
    // Barrel Component
    createComponent(
      'Barrel',
      [
        createFormField('dropdown', 'Barrel Material', ['Wood', 'Plastic', 'Composite'], null, null, 'barrel_material', null, null, {}, null, null, null, null, true),
        createFormField('text', 'Barrel Notes', [], null, null, 'barrel_notes'),
        createFormField('number', 'Barrel Length (cm)', [], null, null, 'barrel_length', null, null, {}, null, null, null, null, true),
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
              null,
              []
            ),
            createTask(
              'Inspect Material',
              [
                createFormField('text', 'Inspector Name', [], null, null, 'inspector_name', null, null, {}, null, null, null, null, true),
              ],
              null,
              null,
              [
                { type: 'task', component: 'Barrel', taskGroup: 'Material Preparation', task: 'Select Barrel Material' },
              ],
              [
                { component: 'Barrel', taskGroup: 'Material Preparation', task: 'Inspect Material', field: 'inspector_name' },
              ]
            ),
            createTask(
              'Cut Material',
              [
                createFormField('number', 'Length to Cut (cm)', [], null, null, 'cut_length', null, null, {}, null, null, null, null, true),
              ],
              null,
              null,
              [
                { type: 'task', component: 'Barrel', taskGroup: 'Material Preparation', task: 'Inspect Material' },
              ],
              [
                { component: 'Barrel', taskGroup: 'Material Preparation', task: 'Cut Material', field: 'cut_length' },
              ]
            ),
          ]
        ),
        createTaskGroup(
          'Barrel Assembly',
          [
            createTask(
              'Sand Barrel Edges',
              [
                createFormField('checkbox', 'Edges Smooth?', [], null, null, 'edges_smooth', null, null, {}, null, null, null, null, false),
              ],
              null,
              null,
              [
                { type: 'task', component: 'Barrel', taskGroup: 'Material Preparation', task: 'Cut Material' },
              ],
              [
                { component: 'Barrel', taskGroup: 'Barrel Assembly', task: 'Sand Barrel Edges', field: 'edges_smooth' },
              ]
            ),
            createTask(
              'Assemble Barrel',
              [
                createFormField('text', 'Assembly Notes', [], null, null, 'assembly_notes', null, null, {}, null, null, null, null, true),
              ],
              null,
              null,
              [
                { type: 'task', component: 'Barrel', taskGroup: 'Barrel Assembly', task: 'Sand Barrel Edges' },
              ],
              [
                { component: 'Barrel', taskGroup: 'Barrel Assembly', task: 'Assemble Barrel', field: 'assembly_notes' },
              ]
            ),
            createTask(
              'Quality Check',
              [
                createFormField('text', 'Quality Assurance Officer', [], null, null, 'qa_officer', null, null, {}, null, null, null, null, true),
                createFormField('checkbox', 'Approved?', [], null, null, 'approved_checkbox', null, null, {}, null, null, null, null, true),
              ],
              null,
              null,
              [
                { type: 'task', component: 'Barrel', taskGroup: 'Barrel Assembly', task: 'Assemble Barrel' },
              ],
              [
                { component: 'Barrel', taskGroup: 'Barrel Assembly', task: 'Quality Check', field: 'qa_officer' },
                { component: 'Barrel', taskGroup: 'Barrel Assembly', task: 'Quality Check', field: 'approved_checkbox' },
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
        createFormField('dropdown', 'Core Type', ['Graphite', 'Lead', 'Charcoal'], null, null, 'core_type', null, null, {}, null, null, null, null, true),
        createFormField('number', 'Core Diameter (mm)', [], null, null, 'core_diameter', null, null, {}, null, null, null, null, true),
        createFormField('number', 'Core Length (cm)', [], null, null, 'core_length', null, null, {}, null, null, null, null, true),
      ],
      [
        createTaskGroup(
          'Core Production',
          [
            createTask(
              'Mix Materials',
              [
                createFormField('text', 'Material Mix Notes', [], null, null, 'mix_notes', null, null, {}, null, null, null, null, true),
              ],
              null,
              null,
              null,
              [
                { component: 'Core', taskGroup: 'Core Production', task: 'Mix Materials', field: 'mix_notes' },
              ]
            ),
            createTask(
              'Mold Core',
              [
                createFormField('text', 'Mold Technician Name', [], null, null, 'mold_technician', null, null, {}, null, null, null, null, true),
              ],
              null,
              null,
              [
                { type: 'task', component: 'Core', taskGroup: 'Core Production', task: 'Mix Materials' },
              ],
              [
                { component: 'Core', taskGroup: 'Core Production', task: 'Mold Core', field: 'mold_technician' },
              ]
            ),
            createTask(
              'Refine Core',
              [
                createFormField('number', 'Refinement Time (minutes)', [], null, null, 'refinement_time', null, null, {}, null, null, null, null, true),
              ],
              null,
              null,
              [
                { type: 'task', component: 'Core', taskGroup: 'Core Production', task: 'Mold Core' },
              ],
              [
                { component: 'Core', taskGroup: 'Core Production', task: 'Refine Core', field: 'refinement_time' },
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
                createFormField('text', 'Tester Name', [], null, null, 'tester_name', null, null, {}, null, null, null, null, true),
                createFormField('number', 'Test Pressure (kg/cm²)', [], null, null, 'test_pressure', null, null, {}, null, null, null, null, true),
              ],
              null,
              null,
              null,
              [
                { component: 'Core', taskGroup: 'Core Testing', task: 'Stress Test', field: 'tester_name' },
                { component: 'Core', taskGroup: 'Core Testing', task: 'Stress Test', field: 'test_pressure' },
              ]
            ),
            createTask(
              'Finalize Core',
              [
                createFormField('checkbox', 'Core Approved', [], null, null, 'core_approved', null, null, {}, null, null, null, null, true),
              ],
              null,
              null,
              [
                { type: 'task', component: 'Core', taskGroup: 'Core Testing', task: 'Stress Test' },
              ],
              [
                { component: 'Core', taskGroup: 'Core Testing', task: 'Finalize Core', field: 'core_approved' },
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
        createFormField('dropdown', 'Eraser Material', ['Rubber', 'Vinyl'], null, null, 'eraser_material', null, null, {}, null, null, null, null, true),
        createFormField('text', 'Eraser Customization Notes', [], null, null, 'eraser_notes'),
        createFormField('checkbox', 'Eraser Tested?', [], null, null, 'eraser_tested'),
      ],
      [
        createTaskGroup(
          'Eraser Production',
          [
            createTask(
              'Cut Eraser Shape',
              [
                createFormField('dropdown', 'Shape', ['Round', 'Square', 'Custom'], null, null, 'eraser_shape', null, null, {}, null, null, null, null, true),
              ],
              null,
              null,
              [
                {type: 'component', component: 'Barrel'}
              ],
              [
                { component: 'Eraser', taskGroup: 'Eraser Production', task: 'Cut Eraser Shape', field: 'eraser_shape' },
              ]
            ),
            createTask(
              'Color Eraser',
              [
                createFormField('dropdown', 'Color', ['Pink', 'White', 'Blue'], null, null, 'eraser_color', null, null, {}, null, null, null, null, true),
              ],
              null,
              null,
              [
                { type: 'task', component: 'Eraser', taskGroup: 'Eraser Production', task: 'Cut Eraser Shape' },
              ],
              [
                { component: 'Eraser', taskGroup: 'Eraser Production', task: 'Color Eraser', field: 'eraser_color' },
              ]
            ),
          ]
        ),
      ]
    ),
  ]
);

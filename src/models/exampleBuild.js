//src/models/exampleBuild.js
import { createBuild, createComponent, createTaskGroup, createTask, createFormField } from './Schema.js';

export const exampleBuild = createBuild('Make Pencil ', [
    //form fields
    createFormField('text','Name Your Pencil '),
    createFormField('checkbox','Gift?'),
    createFormField('text','Large Print Message? '),
    createFormField('text','Small Print Message? '),
    
],
[
    //components 
    createComponent('Barrel',
        [
            //form fields
            createFormField('dropdown','Barrel Material ',['wood','plastic','composite']),
        ],[
            //task groups
            createTaskGroup('Make Barrel',[
                //tasks
                createTask('Cut Length',[
                    //form fields
                ],null,null,'Cut Length'),
                createTask('Prep For Core', [
                    //form fields
                ],null,null,'Prep For Core'),
                createTask('Paint',
                    [
                        //form fields
                        createFormField('dropdown','Color ',['yellow','red','blue','green'])
                    ],null,null,'Paint')
            ],'Make Barrel')
        ],null,'Barrel'),
    createComponent('Core',
        [
            //form fields
            createFormField('dropdown','No. ',['1','2','3']),
            createFormField('dropdown','Core Material ',['lead','graphite','G10'])
        ],
        [
            //task groups
            createTaskGroup('Refine Core',
                [
                    //tasks
                    createTask('Refine Core',[],null,null,'Refine Core')
                ]
            )
        ]

    ),
    createComponent('Eraser',
        [
            // form fields
            createFormField('dropdown','Eraser Color ',['pink','white','blue','green'])
        ],
        [
            // task groups
            createTaskGroup('Make Eraser',
                [
                    //tasks
                    createTask('Cut Eraser', 
                        [
                            // form field 
                            createFormField('dropdown','Eraser Shape ',['circle','star','square'])
                        ]),
                    createTask('Wrap Eraser',
                        [
                            // form fields
                        ]
                    )
                ]
            )
        ]
    )
]

)
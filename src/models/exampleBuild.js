import { createBuild, createComponent, createTaskGroup, createTask, createFormField } from './Schema.js';

export const exampleBuild = createBuild('Make Pencil', [
    //form fields
    createFormField('text','Name'),
    createFormField('dropdown','No.'['1','2','3']),
    createFormField('dropdown','Barrel Material',['wood','plastic','composite']),
    createFormField('dropdown','Core Material',['lead','graphite','G10'])
],
[
    //components 
    createComponent('Barrel',
        [
            //form fields
        ],[
            //task groups
            createTaskGroup('Make Barrel',[
                //tasks
                createTask('cut length',[
                    //form fields
                ],null,null,'Cut Length')
            ],'Make Barrel')
        ],null,'Barrel')
]

)
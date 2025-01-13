//src/context/BuildContext.js
import React, { createContext, useState, useContext } from 'react';
import { sampleBuild } from '../models/sampleBuild.js';
import { testBuild } from '../models/testBuild.js';
import { exampleBuild } from '../models/exampleBuild.js';


const BuildContext = createContext();


export const BuildProvider = ({ value, children }) => {
  const builds = { sampleBuild, testBuild, exampleBuild }; // Add new builds here
  const defaultBuildKey = process.env.NODE_ENV === 'test' ? 'testBuild' : 'sampleBuild';
  const [currentBuildKey, setCurrentBuildKey] = useState(defaultBuildKey); 
  const [build, setBuild] = useState(builds[currentBuildKey]);
  const [messages, setMessages] = useState({});

  const switchBuild = (newBuild) => {
    if (typeof newBuild === 'string') {
      // Predefined builds
      if (newBuild === 'sampleBuild') setBuild(sampleBuild);
      else if (newBuild === 'testBuild') setBuild(testBuild);
      else if (newBuild === 'exampleBuild') setBuild(exampleBuild);
      else console.error('Unknown build selected:', newBuild);
    } else if (typeof newBuild === 'object') {
      setBuild(newBuild);
    } else {
      console.error('Invalid build type provided to switchBuild:', newBuild);
    }
  };
  



  const updateTaskStatus = (componentId, taskGroupId, taskId, newStatus, setMessage) => {
    setBuild((prevBuild) => {
        const updatedComponents = prevBuild.components.map((component) => {
            if (component.id !== componentId) return component;

            const updatedTaskGroups = component.taskGroups.map((taskGroup) => {
                if (taskGroup.id !== taskGroupId) return taskGroup;

                const updatedTasks = taskGroup.tasks.map((task) => {
                    if (task.id !== taskId) return task;

                    if (newStatus === 'complete' && task.status !== 'in-progress') {
                        console.warn(`${task.name} must be "in-progress" before it can be marked "complete".`);
                        setMessages((prevMessages) => ({
                          ...prevMessages,
                          [taskId]: {
                            text: `${task.name} must be "in-progress" before it can be marked "complete".`,
                            style: {color: 'red'}
                          },
                        }));

                        setTimeout(() => {
                          setMessages((prevMessages) => {
                            const newMessages = { ...prevMessages };
                            delete newMessages[taskId];
                            return newMessages;
                          })
                        },5000)
                        return task; 
                    }

                    return { ...task, status: newStatus };
                });

                const taskGroupStatus = deriveStatus(updatedTasks);

                return { ...taskGroup, tasks: updatedTasks, status: taskGroupStatus };
            });

            const componentStatus = deriveStatus(updatedTaskGroups);

            return { ...component, taskGroups: updatedTaskGroups, status: componentStatus };
        });

        const buildStatus = deriveStatus(updatedComponents);

        return { ...prevBuild, components: updatedComponents, status: buildStatus };
    });
};


 

const updateFormField = (componentId, taskGroupId, taskId, fieldId, newValue) => {
  console.log('--- updateFormField called ---');
  console.log('Arguments:', { componentId, taskGroupId, taskId, fieldId, newValue });

  setBuild((prevBuild) => {
    let updatedBuild = { ...prevBuild }; // Clone the build for immutability

    if (!componentId) {
      console.log('[DEBUG] Updating build-level field');
      // Build-level fields
      updatedBuild.formFields = prevBuild.formFields.map((field) => {
        if (field.id === fieldId) {
          console.log(`[DEBUG] Updating build-level field ${fieldId} with value ${newValue}`);
          return { ...field, value: newValue };
        }
        return field;
      });
      console.log('[DEBUG] Updated build-level formFields:', updatedBuild.formFields);
      return updatedBuild;
    }

    // Component-level and below
    updatedBuild.components = prevBuild.components.map((component) => {
      if (component.id !== componentId) return component;

      console.log(`[DEBUG] Found target componentId: ${componentId}`);

      if (!taskGroupId) {
        // Component-level fields
        console.log('[DEBUG] Updating component-level field');
        component.formFields = component.formFields.map((field) => {
          if (field.id === fieldId) {
            console.log(`[DEBUG] Updating component-level field ${fieldId} with value ${newValue}`);
            return { ...field, value: newValue };
          }
          return field;
        });
        console.log('[DEBUG] Updated component-level formFields:', component.formFields);
        return component;
      }

      // Task group-level and task-level fields
      component.taskGroups = component.taskGroups.map((taskGroup) => {
        if (taskGroup.id !== taskGroupId) return taskGroup;

        console.log(`[DEBUG] Found target taskGroupId: ${taskGroupId}`);

        taskGroup.tasks = taskGroup.tasks.map((task) => {
          if (task.id !== taskId) return task;

          console.log(`[DEBUG] Found target taskId: ${taskId}`);

          task.formFields = task.formFields.map((field) => {
            if (field.id === fieldId) {
              console.log(`[DEBUG] Updating task-level field ${fieldId} with value ${newValue}`);
              return { ...field, value: newValue };
            }
            return field;
          });
          console.log('[DEBUG] Updated task-level formFields:', task.formFields);
          return task;
        });
        return taskGroup;
      });
      return component;
    });

    console.log('[DEBUG] Updated build structure:', JSON.stringify(updatedBuild, null, 2));
    return updatedBuild;
  });
};


 
  const deriveStatus = (children) => {
    const statuses = children.map((child) => child.status);
    if (statuses.every((status) => status === 'complete')) return 'complete';
    if (statuses.some((status) => status === 'in-progress' || status === 'complete')) return 'in-progress';
    return 'pending';
  };

 
  const isReadOnly = (item, build) => {
    if (!item.readOnlyConditions) {
        if (process.env.NODE_ENV === 'development') {
            console.warn(`No readOnlyConditions for ${item.name || item.id}`);
        }
        return false;
    }

    if (typeof item.readOnlyConditions !== 'function') {
        return false;
    }

    return item.readOnlyConditions(build);
};

  
  const isVisible = (item, build) => {  
    if (!item.visibilityConditions && process.env.NODE_ENV === 'development') {
      console.warn(`No visibilityConditions for ${item.name || item.id}`);
      return true; 
    }
    if (typeof item.visibilityConditions !== 'function' && process.env.NODE_ENV === 'development') {
      console.error(`Invalid visibilityConditions type for ${item.name || item.id}:`, item.visibilityConditions);
      return !!item.visibilityConditions;
    }
    try {
      const result = item.visibilityConditions(build);
      return result;
    } catch (error) {
      if (process.env.NODE_ENV === 'development'){
        console.error(`Error evaluating visibilityConditions for ${item.name || item.id}:`, error);
      }
      return true; 
    }
  };
  
  //console.log('BuildProvider value:', value); //debugging log

  return (
    <BuildContext.Provider value={{ value, build, switchBuild, updateTaskStatus, updateFormField, isReadOnly, isVisible, message: messages, setMessage: setMessages, }}>
      {children}
    </BuildContext.Provider>
  );
};

export const useBuildContext = () => {
  const context = useContext(BuildContext);
  //console.log('Context in useBuildContext:', context); //debugging log
  return context;
};

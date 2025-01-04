//src/context/BuildContext.js
import React, { createContext, useState, useContext } from 'react';
import { sampleBuild } from '../models/sampleBuild.js';
import { testBuild } from '../models/testBuild.js';

const BuildContext = createContext();


export const BuildProvider = ({ value, children }) => {
  const builds = { sampleBuild, testBuild }; // Add new builds here
  const defaultBuildKey = process.env.NODE_ENV === 'test' ? 'testBuild' : 'sampleBuild';
  const [currentBuildKey, setCurrentBuildKey] = useState(defaultBuildKey); 
  const [build, setBuild] = useState(builds[currentBuildKey]);

  const switchBuild = (newBuild) => {
    if (typeof newBuild === 'string') {
      // Predefined builds
      if (newBuild === 'sampleBuild') setBuild(sampleBuild);
      else if (newBuild === 'testBuild') setBuild(testBuild);
      else console.error('Unknown build selected:', newBuild);
    } else if (typeof newBuild === 'object') {
      setBuild(newBuild);
    } else {
      console.error('Invalid build type provided to switchBuild:', newBuild);
    }
  };
  



  const updateTaskStatus = (componentId, taskGroupId, taskId, newStatus) => {
    setBuild((prevBuild) => {
      const updatedComponents = prevBuild.components.map((component) => {
        if (component.id !== componentId) return component;

        const updatedTaskGroups = component.taskGroups.map((taskGroup) => {
          if (taskGroup.id !== taskGroupId) return taskGroup;

          const updatedTasks = taskGroup.tasks.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          );

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
    setBuild((prevBuild) => {
      if (!componentId) {
        // Build-level fields
        const updatedFormFields = prevBuild.formFields.map((field) =>
          field.id === fieldId ? { ...field, value: newValue } : field
        );
        return { ...prevBuild, formFields: updatedFormFields };
      }
  
      // Component-level and below
      const updatedComponents = prevBuild.components.map((component) => {
        if (component.id !== componentId) return component;
  
        if (!taskGroupId) {
          // Component-level fields
          const updatedFormFields = component.formFields.map((field) =>
            field.id === fieldId ? { ...field, value: newValue } : field
          );
          return { ...component, formFields: updatedFormFields };
        }
  
        // Task group-level and task-level fields
        const updatedTaskGroups = component.taskGroups.map((taskGroup) => {
          if (taskGroup.id !== taskGroupId) return taskGroup;
  
          const updatedTasks = taskGroup.tasks.map((task) => {
            if (task.id !== taskId) return task;
  
            const updatedFields = task.formFields.map((field) =>
              field.id === fieldId ? { ...field, value: newValue } : field
            );
  
            return { ...task, formFields: updatedFields };
          });
  
          return { ...taskGroup, tasks: updatedTasks };
        });
  
        return { ...component, taskGroups: updatedTaskGroups };
      });
  
      return { ...prevBuild, components: updatedComponents };
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
    if (!item.visibilityConditions) {
      console.warn(`No visibilityConditions for ${item.name || item.id}`);
      return true; 
    }
    if (typeof item.visibilityConditions !== 'function') {
      console.error(`Invalid visibilityConditions type for ${item.name || item.id}:`, item.visibilityConditions);
      return !!item.visibilityConditions;
    }
    try {
      const result = item.visibilityConditions(build);
      return result;
    } catch (error) {
      console.error(`Error evaluating visibilityConditions for ${item.name || item.id}:`, error);
      return true; 
    }
  };
  
  console.log('BuildProvider value:', value);

  return (
    <BuildContext.Provider value={{ value, build, switchBuild, updateTaskStatus, updateFormField, isReadOnly, isVisible }}>
      {children}
    </BuildContext.Provider>
  );
};

export const useBuildContext = () => {
  const context = useContext(BuildContext);
  console.log('Context in useBuildContext:', context);
  return context;
};

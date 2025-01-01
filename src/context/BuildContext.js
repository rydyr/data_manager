//src/context/BuildContext.js
import React, { createContext, useState, useContext } from 'react';
import { sampleBuild } from '../models/sampleBuild.js';
import { testBuild } from '../models/testBuild.js';

const BuildContext = createContext();

// Provider Component
export const BuildProvider = ({ children }) => {
  const builds = { sampleBuild, testBuild }; // Add new builds here
  const [currentBuildKey, setCurrentBuildKey] = useState('testBuild'); // Default build
  const [build, setBuild] = useState(builds[currentBuildKey]);

  const switchBuild = (newBuild) => {
    if (typeof newBuild === 'string') {
      // Switch between predefined builds
      if (newBuild === 'sampleBuild') setBuild(sampleBuild);
      else if (newBuild === 'testBuild') setBuild(testBuild);
      else console.error('Unknown build selected:', newBuild);
    } else if (typeof newBuild === 'object') {
      // Replace with loaded build
      setBuild(newBuild);
    } else {
      console.error('Invalid build type provided to switchBuild:', newBuild);
    }
  };
  

  // Update Task Status Function
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

  // Update Form Field Value
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
  

  // Helper function to derive status
  const deriveStatus = (children) => {
    const statuses = children.map((child) => child.status);
    if (statuses.every((status) => status === 'complete')) return 'complete';
    if (statuses.some((status) => status === 'in-progress' || status === 'complete')) return 'in-progress';
    return 'pending';
  };

  // Helper function to evaluate Read-Only
  const isReadOnly = (item, build) => {  
    if (!item.readOnlyConditions) {
      console.warn(`No readOnlyConditions for ${item.name || item.id}`);
      return false;
    }
    if (typeof item.readOnlyConditions !== 'function') {
      console.error(`Invalid readOnlyConditions type for ${item.name || item.id}:`, item.readOnlyConditions);
      return !!item.readOnlyConditions;
    }
    try {
      const result = item.readOnlyConditions(build);
      return result;
    } catch (error) {
      console.error(`Error evaluating readOnlyConditions for ${item.name || item.id}:`, error);
      return false; // Fail-safe
    }
  };
  
  const isVisible = (item, build) => {  
    if (!item.visibilityConditions) {
      console.warn(`No visibilityConditions for ${item.name || item.id}`);
      return true; // Default to visible if no conditions are specified
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
      return true; // Fail-safe to visible
    }
  };
  

  return (
    <BuildContext.Provider value={{ build, switchBuild, updateTaskStatus, updateFormField, isReadOnly, isVisible }}>
      {children}
    </BuildContext.Provider>
  );
};

// Custom hook for consuming the context
export const useBuildContext = () => useContext(BuildContext);
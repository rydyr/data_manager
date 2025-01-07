import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BuildProvider } from '../src/context/BuildContext.js';
import App from '../src/App.js';


window.HTMLElement.prototype.scrollIntoView = jest.fn();


jest.mock('../src/context/BuildContext.js', () => {
  const React = require('react');
  const BuildContext = React.createContext();

  return {
    BuildContext,
    BuildProvider: ({ children, value }) => (
      <BuildContext.Provider value={value}>
        {children}
      </BuildContext.Provider>
    ),
    useBuildContext: () => React.useContext(BuildContext),
  };
});

describe('Component Interaction', () => {
  
  test('simulates build selection from dropdown and updates build', () => {
      const mockSwitchBuild = jest.fn();
  
      const mockBuildContext = {
        build: {
          id: 'test-build-id',
          name: 'sampleBuild',
          label: 'Sample Build',
          formFields: [],
          components: [],
        },
        switchBuild: mockSwitchBuild,
        updateTaskStatus: jest.fn(),
        updateFormField: jest.fn(),
        isReadOnly: jest.fn().mockReturnValue(false),
        isVisible: jest.fn().mockReturnValue(true),
      };
  
      render(
        <BuildProvider value={mockBuildContext}>
          <App />
        </BuildProvider>
      );
    
  
      const dropdown = screen.getByRole('combobox', { name: /switch build/i });
  
      //console.log('Initial dropdown value (before change):', dropdown.value); //debugging log
      const options = Array.from(dropdown.options).map((option) => option.value);
      //console.log('Dropdown options:', options); //debugging log
  
      // Simulate selecting a different build
      fireEvent.change(dropdown, { target: { value: 'testBuild' } });
  
      //console.log('Mock calls after change:', mockSwitchBuild.mock.calls); //debugging log
  
      // Assert that switchBuild is called with the correct build ID
      expect(mockSwitchBuild).toHaveBeenCalledWith('testBuild');
    });
  
    const mockableBuildContext = {
      build: {
        id: 'test-build-id',
        name: 'Test Build',
        label: 'Test Build',
        status: 'pending',
        formFields: [],
        components: [
          {
            id: 'component-a',
            name: 'Component A',
            status: 'pending',
            formFields: [],
            taskGroups: [
              {
                id: 'task-group-a1',
                name: 'Task Group A1',
                status: 'pending',
                tasks: [
                  {
                    id: 'task-a1-1',
                    name: 'Task A1.1',
                    status: 'pending',
                    formFields: [
                      {
                        id: 'field-note',
                        label: 'Task A1.1 Note',
                        type: 'text',
                        value: '',
                      },
                    ],
                  },
                  {
                    id: 'task-a1-2',
                    name: 'Task A1.2',
                    status: 'in-progress',
                    formFields: [
                      {
                        id: 'field-status',
                        label: 'Task A1.2 Status',
                        type: 'dropdown',
                        value: 'In Progress',
                        options: ['Pending', 'In Progress', 'Complete'],
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            id: 'component-b',
            name: 'Component B',
            status: 'in-progress',
            formFields: [],
            taskGroups: [
              {
                id: 'task-group-b1',
                name: 'Task Group B1',
                status: 'in-progress',
                tasks: [
                  {
                    id: 'task-b1-1',
                    name: 'Task B1.1',
                    status: 'pending',
                    formFields: [
                      {
                        id: 'field-description',
                        label: 'Task B1.1 Description',
                        type: 'text',
                        value: '',
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
      switchBuild: jest.fn(),
      updateTaskStatus: jest.fn(),
      updateFormField: jest.fn(),
      isReadOnly: jest.fn().mockReturnValue(false),
      isVisible: jest.fn().mockReturnValue(true),
    };
    

    test('expands a component and renders its associated tasks', () => {
            
      render(
        <BuildProvider value={mockableBuildContext}>
          <App />
        </BuildProvider>
      );
    
      // Expand Component A
      const componentAToggle = screen.getByText(/Component A - Status: pending/i);
      fireEvent.click(componentAToggle);
    
      // Assert: Task Group A1 is displayed
      expect(screen.getByText(/Task Group A1 - Status: pending/i)).toBeInTheDocument();
    
      // Expand Task Group A1
      const taskGroupA1Toggle = screen.getByText(/Task Group A1 - Status: pending/i);
      fireEvent.click(taskGroupA1Toggle);
    
      // Assert: Tasks A1.1 and A1.2 are displayed
      expect(screen.getByText(/Task A1.1 - Status: pending/i)).toBeInTheDocument();
      expect(screen.getByText(/Task A1.2 - Status: in-progress/i)).toBeInTheDocument();
    });
    
    test('expands a task group and validates form field rendering', () => {
      
      render(
        <BuildProvider value={mockableBuildContext}>
          <App />
        </BuildProvider>
      );
    
      // Expand Component A
      const componentAToggle = screen.getByText(/Component A - Status: pending/i);
      fireEvent.click(componentAToggle);
    
      // Expand Task Group A1
      const taskGroupA1Toggle = screen.getByText(/Task Group A1 - Status: pending/i);
      fireEvent.click(taskGroupA1Toggle);
    
      // Assert: Tasks A1.1 and A1.2 are displayed
      expect(screen.getByText(/Task A1.1 - Status: pending/i)).toBeInTheDocument();
      expect(screen.getByText(/Task A1.2 - Status: in-progress/i)).toBeInTheDocument();
    
      // Assert: Form fields for Task A1.1 are rendered
      expect(screen.getByLabelText(/Task A1.1 Note/i)).toBeInTheDocument();
    
      // Assert: Form fields for Task A1.2 are rendered
      const dropdownField = screen.getByLabelText(/Task A1.2 Status/i);
      expect(dropdownField).toBeInTheDocument();
    
      // Simulate a dropdown change for Task A1.2 and validate state update
      fireEvent.change(dropdownField, { target: { value: 'Complete' } });
      expect(mockableBuildContext.updateFormField).toHaveBeenCalledWith(
        'component-a',
        'task-group-a1',
        'task-a1-2',
        'field-status',
        'Complete'
      );
    });
    
    test('updates task status using status buttons', () => {
      render(
        <BuildProvider value={mockableBuildContext}>
          <App />
        </BuildProvider>
      );
    
      // Expand Component A
      const componentAToggle = screen.getByText(/Component A - Status: pending/i);
      fireEvent.click(componentAToggle);
    
      // Expand Task Group A1
      const taskGroupA1Toggle = screen.getByText(/Task Group A1 - Status: pending/i);
      fireEvent.click(taskGroupA1Toggle);
    
      // Assert: Task A1.1 is displayed
      const taskA1_1 = screen.getByTestId(
        'task-component-a-task-group-a1-task-a1.1'
      );
      expect(taskA1_1).toBeInTheDocument();
    
      // Locate 'Set In Progress' button for Task A1.1 using a scoped query
      const setInProgressButton = within(taskA1_1).getByText(/Set In Progress/i);
    
      // Simulate clicking the 'Set In Progress' button
      fireEvent.click(setInProgressButton);
    
      // Assert: updateTaskStatus is called with correct arguments
      expect(mockableBuildContext.updateTaskStatus).toHaveBeenCalledWith(
        'component-a',
        'task-group-a1',
        'task-a1-1',
        'in-progress'
      );
    
      // Locate 'Set Complete' button for Task A1.1
      const setCompleteButton = within(taskA1_1).getByText(/Set Complete/i);
    
      // Simulate clicking the 'Set Complete' button
      fireEvent.click(setCompleteButton);
    
      // Assert: updateTaskStatus is called with correct arguments
      expect(mockableBuildContext.updateTaskStatus).toHaveBeenCalledWith(
        'component-a',
        'task-group-a1',
        'task-a1-1',
        'complete'
      );
    });
    
    test('validates visibility and read-only conditions for tasks and form fields', () => {
      // Update mock context to handle visibility and read-only conditions
      const enhancedContext = {
        ...mockableBuildContext,
        isReadOnly: jest.fn((field) => field.id === 'field-note'), // Only field-note is read-only
        isVisible: jest.fn((taskOrField) => taskOrField.id !== 'field-status-hidden'), // Assume all fields except hidden ones are visible
      };
    
      render(
        <BuildProvider value={enhancedContext}>
          <App />
        </BuildProvider>
      );
    
      // Expand Component A
      const componentAToggle = screen.getByText(/Component A - Status: pending/i);
      fireEvent.click(componentAToggle);
    
      // Expand Task Group A1
      const taskGroupA1Toggle = screen.getByText(/Task Group A1 - Status: pending/i);
      fireEvent.click(taskGroupA1Toggle);
    
      // Assert: Task A1.1 is visible
      expect(screen.getByText(/Task A1.1 - Status: pending/i)).toBeInTheDocument();
    
      // Assert: Task A1.1 form field is read-only
      const readOnlyField = screen.getByLabelText(/Task A1.1 Note/i);
      expect(readOnlyField).toHaveAttribute('readOnly');
    
      // Assert: Task A1.2 is visible
      expect(screen.getByText(/Task A1.2 - Status: in-progress/i)).toBeInTheDocument();
    
      // Assert: Task A1.2 form field is editable
      const editableField = screen.getByLabelText(/Task A1.2 Status/i);
      expect(editableField).not.toHaveAttribute('readOnly');
      fireEvent.change(editableField, { target: { value: 'Complete' } });
    
      // Validate updateFormField is called with correct arguments
      expect(enhancedContext.updateFormField).toHaveBeenCalledWith(
        'component-a',
        'task-group-a1',
        'task-a1-2',
        'field-status',
        'Complete'
      );
    });
    

});


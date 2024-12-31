// tests/BuildContext.test.js
import React from 'react';
import { renderHook, act } from '@testing-library/react-hooks';
import { BuildProvider, useBuildContext } from '../src/context/BuildContext.js';
import { testBuild } from '../src/models/Schema.js';

describe('BuildContext Tests', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = ({ children }) => <BuildProvider>{children}</BuildProvider>;
  });

  // Helper functions for accessing schema objects
  const getComponentByName = (build, name) =>
    build.components.find((component) => component.name === name);

  const getTaskGroupByName = (component, name) =>
    component.taskGroups.find((taskGroup) => taskGroup.name === name);

  const getTaskByName = (taskGroup, name) =>
    taskGroup.tasks.find((task) => task.name === name);

  const getFieldByName = (task, label) =>
    task.formFields.find((field) => field.label === label);

  test('provides the default build state', () => {
    const { result } = renderHook(() => useBuildContext(), { wrapper });
    expect(result.current.build).toEqual(testBuild);
  });

  test('updates task status correctly', () => {
    const { result } = renderHook(() => useBuildContext(), { wrapper });

    act(() => {
      const component = getComponentByName(result.current.build, 'Test Component');
      const taskGroup = getTaskGroupByName(component, 'Test Task Group');
      const task = getTaskByName(taskGroup, 'Test Task 1');
      result.current.updateTaskStatus(component.id, taskGroup.id, task.id, 'complete');
    });

    const updatedTask = getTaskByName(
      getTaskGroupByName(getComponentByName(result.current.build, 'Test Component'), 'Test Task Group'),
      'Test Task 1'
    );

    expect(updatedTask.status).toBe('complete');
  });

  test('updates form field value correctly', () => {
    const { result } = renderHook(() => useBuildContext(), { wrapper });

    act(() => {
      const component = getComponentByName(result.current.build, 'Test Component');
      const taskGroup = getTaskGroupByName(component, 'Test Task Group');
      const task = getTaskByName(taskGroup, 'Test Task 1');
      const field = getFieldByName(task, 'Test Text Field 1');
      result.current.updateFormField(component.id, taskGroup.id, task.id, field.id, 'Updated Value');
    });

    const updatedField = getFieldByName(
      getTaskByName(
        getTaskGroupByName(getComponentByName(result.current.build, 'Test Component'), 'Test Task Group'),
        'Test Task 1'
      ),
      'Test Text Field 1'
    );

    expect(updatedField.value).toBe('Updated Value');
  });

  test('deriveStatus computes correct status for mixed task states', () => {
    const { result } = renderHook(() => useBuildContext(), { wrapper });

    act(() => {
      const component = getComponentByName(result.current.build, 'Test Component');
      const taskGroup = getTaskGroupByName(component, 'Test Task Group');
      const task1 = getTaskByName(taskGroup, 'Test Task 1');
      const task2 = getTaskByName(taskGroup, 'Test Task 2');

      result.current.updateTaskStatus(component.id, taskGroup.id, task1.id, 'complete');
      result.current.updateTaskStatus(component.id, taskGroup.id, task2.id, 'in-progress');
    });

    const taskGroupStatus = getTaskGroupByName(
      getComponentByName(result.current.build, 'Test Component'),
      'Test Task Group'
    ).status;

    expect(taskGroupStatus).toBe('in-progress');
  });

  test('isReadOnly returns true for read-only conditions', () => {
    const { result } = renderHook(() => useBuildContext(), { wrapper });

    const mockItem = { readOnlyConditions: (build) => build.status === 'pending' };
    expect(result.current.isReadOnly(mockItem, result.current.build)).toBe(true);
  });

  test('isVisible evaluates custom visibility conditions correctly', () => {
    const { result } = renderHook(() => useBuildContext(), { wrapper });

    const mockItem = { visibilityConditions: (build) => build.status === 'pending' };
    expect(result.current.isVisible(mockItem, result.current.build)).toBe(true);
  });

  test('isReadOnly handles errors in read-only conditions gracefully', () => {
    const { result } = renderHook(() => useBuildContext(), { wrapper });

    const mockItem = { readOnlyConditions: () => { throw new Error('Read-only error'); } };
    expect(result.current.isReadOnly(mockItem, result.current.build)).toBe(false); // Default to not read-only
  });

  test('isVisible handles errors in visibility conditions gracefully', () => {
    const { result } = renderHook(() => useBuildContext(), { wrapper });

    const mockItem = { visibilityConditions: () => { throw new Error('Visibility error'); } };
    expect(result.current.isVisible(mockItem, result.current.build)).toBe(true); // Default to visible
  });

  test('handles empty components gracefully', () => {
    const { result } = renderHook(() => useBuildContext(), { wrapper });

    act(() => {
      result.current.updateTaskStatus('nonexistent', 'nonexistent', 'nonexistent', 'complete');
    });

    expect(result.current.build.components).toHaveLength(1); // No changes to state
  });
});

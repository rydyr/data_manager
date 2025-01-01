import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BuildProvider } from '../src/context/BuildContext.js';
import { testBuild } from '../src/models/testBuild.js';
import App from '../src/App.js';

global.HTMLElement.prototype.scrollIntoView = jest.fn();
/*
test('renders the App component without crashing', () => {
  const { container } = render(
    <BuildProvider value={{ build: testBuild }}>
      <App />
    </BuildProvider>
  );
  expect(container).toBeInTheDocument();
});
*/ 
test('renders form fields for visible components and tasks', () => {
    const testBuildModified = {
        ...testBuild,
        status: 'in-progress',
    };

    const { getByTestId } = render(
        <BuildProvider value={{ build: testBuildModified }}>
            <App />
        </BuildProvider>
    );

    fireEvent.click(getByTestId('component-component-a'));
    fireEvent.click(getByTestId('task-group-a1'));

    expect(getByTestId('task-group-component-a-task-group-a1')).toBeInTheDocument();

});

  
/*
test('renders visible components based on isVisible condition', () => {
  const { getByTestId } = render(
    <BuildProvider value={{ build: testBuild }}>
      <App />
    </BuildProvider>
  );

  // Check that all visible components are rendered
  expect(getByTestId('component-component-a')).toBeInTheDocument();
  expect(getByTestId('component-component-b')).toBeInTheDocument();
  expect(getByTestId('component-component-c')).toBeInTheDocument();
});

test('does not render components that fail the isVisible condition', () => {
  jest.spyOn(React, 'useContext').mockImplementation(() => ({
    build: {
      name: 'Test Build',
      status: 'complete',
      components: [
        {
          id: '1',
          name: 'Invisible Component',
          taskGroups: [],
          isVisible: jest.fn(() => false),
        },
      ],
    },
  }));

  const { queryByTestId } = render(
    <BuildProvider>
      <App />
    </BuildProvider>
  );

  expect(queryByTestId('component-invisible-component')).not.toBeInTheDocument();
});

test('renders form fields for visible components and tasks', () => {
  const testBuildModified = {
    ...testBuild,
    status: 'in-progress', // Ensure the build status satisfies the visibility condition
  };

  const { getByTestId } = render(
    <BuildProvider value={{ build: testBuildModified }}>
      <App />
    </BuildProvider>
  );

  // Expand the component and task group to render nested form fields
  fireEvent.click(getByTestId('component-component-a'));
  fireEvent.click(getByTestId('task-group-a1'));

  // Check for form fields
  expect(getByTestId('component-component-a-task-group-a1-task-task-a1-1-field-note')).toBeInTheDocument();
  expect(getByTestId('component-component-a-task-group-a1-task-task-a1-1-field-complete')).toBeInTheDocument();
});

test('toggles component visibility using the expand button', () => {
  const { getByText } = render(
    <BuildProvider value={{ build: testBuild }}>
      <App />
    </BuildProvider>
  );

  const toggleButton = getByText(/Component A/i);
  expect(toggleButton).toBeInTheDocument();

  fireEvent.click(toggleButton);
  expect(toggleButton).toHaveTextContent('▼');
});

test('toggles task group visibility using the expand button', () => {
  const { getByTestId } = render(
    <BuildProvider value={{ build: testBuild }}>
      <App />
    </BuildProvider>
  );

  const toggleButton = getByTestId('task-group-a1');
  expect(toggleButton).toBeInTheDocument();

  fireEvent.click(toggleButton);
  expect(toggleButton).toHaveTextContent('▼');
});

test('toggles build-level visibility using the expand button', () => {
  const { getByText } = render(
    <BuildProvider value={{ build: testBuild }}>
      <App />
    </BuildProvider>
  );

  const toggleButton = getByText(/Demo Build - Form Fields/i);
  expect(toggleButton).toBeInTheDocument();

  fireEvent.click(toggleButton);
  expect(toggleButton).toHaveTextContent('▼');
});

test('updates task status using the status buttons', async () => {
  const { findByTestId, findByText } = render(
    <BuildProvider value={{ build: testBuild }}>
      <App />
    </BuildProvider>
  );

  const completeButton = await findByTestId('component-component-a-task-group-a1-task-task-a1-1-field-complete');
  fireEvent.click(completeButton);
  expect(await findByText(/Status: complete/i)).toBeInTheDocument();
});

test('updates form field values for text input', async () => {
  const { findByTestId } = render(
    <BuildProvider value={{ build: testBuild }}>
      <App />
    </BuildProvider>
  );

  const textField = await findByTestId('component-component-a-task-group-a1-task-task-a1-1-field-note');
  fireEvent.change(textField, { target: { value: 'Updated Value' } });

  expect(textField.value).toBe('Updated Value');
});
*/
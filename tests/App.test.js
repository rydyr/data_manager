// tests/App.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; 
import { BuildProvider } from '../src/context/BuildContext.js';
import App from '../src/App.js';


window.HTMLElement.prototype.scrollIntoView = jest.fn();


beforeEach(() => {
  jest.clearAllMocks();
});



describe('App Component with testBuild', () => {
  it('should render the testBuild structure correctly after interactions', () => {
    render(
      <BuildProvider>
        <App />
      </BuildProvider>
    );

    // Validate that the build name is displayed
    expect(screen.getByText(/Test Build - Status: pending/i)).toBeInTheDocument();

    // Validate the presence of the components
    expect(screen.getByText(/Component A - Status: pending/i)).toBeInTheDocument();

    // Simulate clicking Component A to expand
    const componentA = screen.getByText(/Component A - Status: pending/i);
    fireEvent.click(componentA);

    // Validate the task group under Component A is rendered
    expect(screen.getByText(/Task Group A1 - Status: pending/i)).toBeInTheDocument();

    // Simulate clicking Task Group A1 to expand
    const taskGroup = screen.getByText(/Task Group A1 - Status: pending/i);
    fireEvent.click(taskGroup);

    // Validate the tasks are rendered
    expect(screen.getByText(/Task A1.1 - Status: pending/i)).toBeInTheDocument();
    expect(screen.getByText(/Task A1.2 - Status: pending/i)).toBeInTheDocument();

    // Validate the form fields for Task 1
    expect(screen.getByLabelText(/Task A1.1 Note/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Task A1.1 Complete/i)).toBeInTheDocument();

    // Validate the form fields for Task 2
    expect(screen.getByLabelText(/Task A1.2 Status/i)).toBeInTheDocument();
  });
});


describe('App Component', () => {
  test('renders without crashing and displays main UI elements', () => {
    render(
      <BuildProvider>
        <App />
      </BuildProvider>
    );

    // Verify the application title
    const appTitle = screen.getByText(/Switch Build/i); 
    expect(appTitle).toBeInTheDocument();

    // Verify the build selector dropdown
    const buildSelector = screen.getByLabelText(/Switch Build:/i); 
    expect(buildSelector).toBeInTheDocument();

    // Verify build options are present
    const buildOptions = screen.getAllByRole('option');
    expect(buildOptions).toHaveLength(2); 
    expect(buildOptions[0]).toHaveTextContent('Sample Build');
    expect(buildOptions[1]).toHaveTextContent('Test Build');
  });
});

test('displays the correct default build based on context', () => {
  const mockContext = {
    build: {
      id: 'default-build-id',
      name: 'Sample Build',
      formFields: [],
      components: [],
    },
    switchBuild: jest.fn(),
    updateTaskStatus: jest.fn(),
    updateFormField: jest.fn(),
    isReadOnly: jest.fn(),
    isVisible: jest.fn(),
  };

  render(
    <BuildProvider value={mockContext}>
      <App />
    </BuildProvider>
  );

  const defaultBuildName = screen.getByText(/Sample Build/i); 
  expect(defaultBuildName).toBeInTheDocument();
});

test('toggles component visibility and updates expanded state', () => {
  const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});

  const mockContext = {
    build: {
      id: 'test-build-id',
      name: 'Test Build',
      components: [
        { id: 'component-a', name: 'Component A', label: 'Component A' },
        { id: 'component-b', name: 'Component B', label: 'Component B' },
      ],
    },
    switchBuild: jest.fn(),
    updateTaskStatus: jest.fn(),
    updateFormField: jest.fn(),
    isReadOnly: jest.fn(),
    isVisible: jest.fn(() => true),
  };

  render(
    <BuildProvider value={mockContext}>
      <App />
    </BuildProvider>
  );

  const toggleButton = screen.getByText(/Component A/i);
  fireEvent.click(toggleButton);

  const logCalls = consoleSpy.mock.calls.map((call) => call[0]);
  const afterToggleMessage = logCalls.find((log) => log.startsWith('After Toggle'));

  const dynamicIdMatch = afterToggleMessage.match(/After Toggle (\S+):/);
  const dynamicId = dynamicIdMatch ? dynamicIdMatch[1] : null;

  expect(dynamicId).not.toBeNull();

  expect(afterToggleMessage).toBe(`After Toggle ${dynamicId}:`);

  consoleSpy.mockRestore();
});

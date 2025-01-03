// tests/App.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Provides custom matchers for Jest
import { BuildProvider } from '../src/context/BuildContext';
import App from '../src/App';
import { testBuild } from '../src/models/testBuild';

window.HTMLElement.prototype.scrollIntoView = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});


/*
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
    const appTitle = screen.getByText(/Switch Build/i); // Adjust the text to match the actual title
    expect(appTitle).toBeInTheDocument();

    // Verify the build selector dropdown
    const buildSelector = screen.getByLabelText(/Switch Build:/i); // Ensure this matches the label in your app
    expect(buildSelector).toBeInTheDocument();

    // Verify build options are present
    const buildOptions = screen.getAllByRole('option');
    expect(buildOptions).toHaveLength(2); // Assuming there are two builds: sampleBuild and testBuild
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

  // Verify the default build name is displayed
  const defaultBuildName = screen.getByText(/Sample Build/i); // Adjust regex based on UI
  expect(defaultBuildName).toBeInTheDocument();
});

test('toggles component visibility and updates expanded state', () => {
  // Mock console.log
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

  // Get toggle button for a specific component
  const toggleButton = screen.getByText(/Component A/i);
  fireEvent.click(toggleButton);

  // Extract the actual "After Toggle" message from the log calls
  const logCalls = consoleSpy.mock.calls.map((call) => call[0]);
  const afterToggleMessage = logCalls.find((log) => log.startsWith('After Toggle'));

  // Dynamically extract the ID from the "After Toggle" message
  const dynamicIdMatch = afterToggleMessage.match(/After Toggle (\S+):/);
  const dynamicId = dynamicIdMatch ? dynamicIdMatch[1] : null;

  // Verify the ID was dynamically captured
  expect(dynamicId).not.toBeNull();

  // Verify the expanded state updated correctly with the captured dynamic ID
  expect(afterToggleMessage).toBe(`After Toggle ${dynamicId}:`);

  // Clean up the mocked console.log
  consoleSpy.mockRestore();
});
*/
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

  console.log('Initial dropdown value (before change):', dropdown.value);
  const options = Array.from(dropdown.options).map((option) => option.value);
  console.log('Dropdown options:', options);

  // Simulate selecting a different build
  fireEvent.change(dropdown, { target: { value: 'testBuild' } });

  console.log('Mock calls after change:', mockSwitchBuild.mock.calls);

  // Assert that switchBuild is called with the correct build ID
  expect(mockSwitchBuild).toHaveBeenCalledWith('testBuild');
});

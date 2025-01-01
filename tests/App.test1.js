import React from 'react';
import { render, screen, fireEvent, within, waitFor } from '@testing-library/react';
import { BuildProvider } from '../src/context/BuildContext.js';
import App from '../src/App.js';
import { testBuild } from '../src/models/Schema.js';

describe('App Component', () => {
  const renderApp = (build = testBuild) => 
    render(
      <BuildProvider value={{ 
        build, 
        updateTaskStatus: jest.fn(), 
        updateFormField: jest.fn(), 
        isReadOnly: jest.fn(() => false), 
        isVisible: jest.fn(() => true),

      }}>
        <App />
      </BuildProvider>
    );

  beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders visible components and task groups', async () => {
    renderApp();

    expect(screen.getByText(/Test Component/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Task Group/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Task 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Task 2/i)).toBeInTheDocument();
  });

  test('updates a text field value', async () => {
    renderApp();

    const input = await screen.findByLabelText(/Test Text Field 1/i);
    fireEvent.change(input, { target: { value: 'Updated Description' } });

    expect(input.value).toBe('Updated Description');
  });

  test('updates a checkbox value', async () => {
    renderApp();

    const checkbox = await screen.findByLabelText(/Test Checkbox 1/i);
    fireEvent.click(checkbox);

    expect(checkbox.checked).toBe(true);
  });

  test('updates a dropdown value', async () => {
    renderApp();

    const dropdown = await screen.findByLabelText(/Test Dropdown 2/i);
    fireEvent.change(dropdown, { target: { value: 'Option B' } });

    expect(dropdown.value).toBe('Option B');
  });

  test('checks if input fields are disabled when read-only', async () => {
    jest.spyOn(React, 'useContext').mockImplementation(() => ({
      build: testBuild,
      updateTaskStatus: jest.fn(),
      updateFormField: jest.fn(),
      isReadOnly: jest.fn((item) => {
        return item.name === 'Test Task 2'; 
      }),
      isVisible: jest.fn(() => true),
    }));

    renderApp();

    const input = await screen.findByLabelText(/Test Number Field 2/i);
    expect(input).toHaveAttribute('readonly');
  });

  const mockUpdateTaskStatus = jest.fn();
  const contextValue ={
    build: testBuild,
    updateTaskStatus: mockUpdateTaskStatus,
    updateFormField: jest.fn(),
    isReadOnly: jest.fn(() => false),
    isVisible: jest.fn(() => true),
  };

  /*

  note: couldn't get mockUpdateTaskStatus to call. Running test with actual context
test('updates task status on button click', async () => {
    render(
        <BuildProvider value={contextValue}>
            <App />
        </BuildProvider>
    );

    const button = await screen.findByTestId('set-complete-Test Component-Test Task Group-Test Task 2');
    
    fireEvent.click(button);

    console.log('Mock calls:', mockUpdateTaskStatus.mock.calls);

    expect(mockUpdateTaskStatus).toHaveBeenCalledTimes(1);
    expect(mockUpdateTaskStatus).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(String),
        expect.any(String),
        'complete'
    );
});
*/

  test('handles conditional rendering when tasks are visible', async () => {
    renderApp();

    expect(screen.getByText(/Test Task 1/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Task 2/i)).toBeInTheDocument();
  });
});

describe('App Component (Using Actual Context)', () => {
  const renderWithProvider = () =>
      render(
          <BuildProvider>
              <App />
          </BuildProvider>
      );

  test('updates task status on button click', async () => {
      renderWithProvider();

      // Find the 'Complete' button for a specific task
      const button = await screen.findByTestId('set-complete-Test Component-Test Task Group-Test Task 2');
      expect(button).toBeInTheDocument();

      // Click the button
      fireEvent.click(button);

      // Verify the task status is updated
      await waitFor(() => {
          const updatedTaskStatus = screen.getByText(/Status: complete/i);
          expect(updatedTaskStatus).toBeInTheDocument();
      });
  });
});

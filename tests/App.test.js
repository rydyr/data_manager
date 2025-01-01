// tests/App.test.js
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom'; // Provides custom matchers for Jest
import { BuildProvider } from '../src/context/BuildContext';
import App from '../src/App';
import { testBuild } from '../src/models/testBuild';

window.HTMLElement.prototype.scrollIntoView = jest.fn();


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

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
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
  
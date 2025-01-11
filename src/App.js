// src/App.js
import React, { useState } from 'react';
import { useBuildContext } from './context/BuildContext.js';
import './App.css'; 

console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

const App = () => {
  
  const { build, switchBuild, updateTaskStatus, updateFormField, isReadOnly, isVisible, message, setMessage } = useBuildContext();
  //console.log('[APP] Build Object:', build); //debugging log
  //console.log('[APP] switchBuild function in App:', switchBuild); //debugging log
  const [expandedComponents, setExpandedComponents] = useState({});
  const [expandedTaskGroups, setExpandedTaskGroups] = useState({});
  const [buildExpanded, setBuildExpanded] = useState(false); 

  const handleFieldChange = (componentId, taskGroupId, taskId, fieldId, newValue) => {
    //console.log('[APP] Field Change:', { componentId, taskGroupId, taskId, fieldId, newValue }); //debugging log
    updateFormField(componentId, taskGroupId, taskId, fieldId, newValue);
  };

  const handleSwitchBuild = (e) => {
    const selectedBuild = e.target.value;
    //console.log('[APP] Switching Build To:', selectedBuild) //debugging log
    switchBuild(selectedBuild);
  };

  const toggleComponent = (componentId) => {
    if(process.env.NODE_ENV === 'test'){
      console.log('[APP] Before Toggle:', expandedComponents); //test log
    }
    setExpandedComponents((prev) => {
      const isExpanded = !prev[componentId];
      if(process.env.NODE_ENV === 'test'){
        console.log(`[APP] After Toggle ${componentId}:`, { ...prev, [componentId]: isExpanded }); //test log
      }   
      if (isExpanded) {
        document.getElementById(`component-${componentId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return { ...prev, [componentId]: isExpanded };
    });
  };

  const toggleTaskGroup = (taskGroupId) => {
    //console.log('[APP] Toggling Task Group:', taskGroupId); //debugging log
    setExpandedTaskGroups((prev) => {
      const isExpanded = !prev[taskGroupId];
      //console.log('[APP] Expanded State for Task Group:', taskGroupId, isExpanded); //debugging log
      if (isExpanded) {
        document.getElementById(`taskGroup-${taskGroupId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return { ...prev, [taskGroupId]: isExpanded };
    });
  };

  const toggleBuild = () => {
    setBuildExpanded((prev) => {
      const isExpanded = !prev;
      if (isExpanded) {
        document.getElementById('build-level')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return isExpanded;
    });
  };

  const showMessage = (options) => {
    if (typeof options === 'string') {
      setMessage({ text: options, style: {}, duration: 5000 });
      setTimeout(() => setMessage(null), 5000);
      return;
    }
  
    const { message, duration = 5000, style = {}, condition = true } = options;
  
    if (typeof condition === 'function' ? condition() : condition) {
      setMessage({ text: message, style, duration });
  
      if (duration > 0) {
        setTimeout(() => setMessage(null), duration);
      }
    }
  };
  

  const getImmediateChildStatusSummary = (children) => {
    if (!Array.isArray(children) || children.length === 0) {
      return '0 / 0';
    }
    const total = children.length;
    const complete = children.filter((child) => child.status === 'complete').length;
    return `${complete} / ${total}`;
  };

  const renderFormFields = (formFields, context = {}) => {
    if (!Array.isArray(formFields) || formFields.length === 0) return null;

    const { componentId = null, taskGroupId = null, taskId = null } = context;

    //console.log(`[APP] Rendering form fields for componentId: ${componentId}, taskGroupId: ${taskGroupId}, taskId: ${taskId}`); //debugging log

    return formFields.map((field) => {
      //console.log(`[APP] Rendering form field: ${field.label} with testId: ${field.testId}`); //debugging log

        const testId = [
            componentId && `component-${componentId}`,
            taskGroupId && `task-group-${taskGroupId}`,
            taskId && `task-${taskId}`,
            `field-${field.label.replace(/\s+/g, '-').toLowerCase()}`
        ]
            .filter(Boolean)
            .join('-');
            //console.log('[APP] Generated testId:', testId); //debugging log

        const shouldShowMessage = field.message && field.messageCondition?.(field);

        return (
            <div key={field.id} style={{ marginBottom: '10px' }}>
                <label htmlFor={`field-${field.id}`} style={{ color: 'inherit' }}>{field.label}</label>
                {field.type === 'text' && (
                    <input
                        id={`field-${field.id}`}
                        type="text"
                        value={field.value}
                        readOnly={isReadOnly(field, build)}
                        onChange={(e) => {
                            handleFieldChange(componentId, taskGroupId, taskId, field.id, e.target.value)
                        }}
                        data-testid={testId}
                    />
                )}
                {field.type === 'number' && (
                    <input
                        id={`field-${field.id}`}
                        type="number"
                        value={field.value}
                        readOnly={isReadOnly(field, build)}
                        onChange={(e) => {
                            handleFieldChange(componentId, taskGroupId, taskId, field.id, e.target.value)
                        }}
                        data-testid={testId}
                    />
                )}
                {field.type === 'checkbox' && (
                    <input
                        id={`field-${field.id}`}
                        type="checkbox"
                        checked={field.value}
                        disabled={isReadOnly(field, build)}
                        onChange={(e) => {
                            handleFieldChange(componentId, taskGroupId, taskId, field.id, e.target.value)
                        }}
                        data-testid={testId}
                    />
                )}
                {field.type === 'dropdown' && (
                    <select
                        id={`field-${field.id}`}
                        value={field.value}
                        disabled={isReadOnly(field, build)}
                        onChange={(e) => {
                            handleFieldChange(componentId, taskGroupId, taskId, field.id, e.target.value)
                        }}
                        data-testid={testId}
                    >
                        {field.options.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                )}
                {shouldShowMessage && (
                  <div
                    className="field-message"
                    style={{
                      marginTop: '5px',
                      ...field.messageStyle,
                    }}
                  >
                    {field.message}
                  </div>
                )}
            </div>
        );
    });
};
  const renderConditions = () => {
    return (
      <div className="conditions">
        <h3>Logical Conditions in this Demo</h3>
        <ul>
          <li><strong>Task A1.1</strong> is visible when <strong>Demo Build - Status</strong> is not "pending".</li>
          <li><strong>Task A1.2</strong> is visible when <strong>Component B</strong> is "in-progress".</li>
          <li><strong>Task B1.1</strong> is read-only when <strong>Demo Build - Status</strong> is "complete".</li>
          <li><strong>Task B1.2</strong> is not visible when <strong>Demo Build - Status</strong> is "complete".</li>
          <li><strong>Task C1.1</strong> is visible when <strong>Component B</strong> is "complete."</li>
          <li><strong>Task C1.2</strong> is visible when <strong>Demo Build - Status</strong> is "in-progress."</li>
          <li><strong>Task C1.2</strong> is read-only when <strong>Task A1.1</strong> is "complete."</li>
        </ul>
      </div>
    );
  };
  const saveBuildAsJSON = () => {
    const jsonData = JSON.stringify(build, null, 2); 
    const blob = new Blob([jsonData], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${build.name.replace(/ /g, '_')}.json`;
    link.click();
  };

  const loadBuildFromJSON = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();
    try {
      const loadedBuild = JSON.parse(text);

      if (
        !loadedBuild.name ||
        !Array.isArray(loadedBuild.components) ||
        loadedBuild.components.some(
          (component) =>
            !component.name ||
            !Array.isArray(component.taskGroups) ||
            component.taskGroups.some(
              (taskGroup) =>
                !taskGroup.name ||
                !Array.isArray(taskGroup.tasks) ||
                taskGroup.tasks.some(
                  (task) =>
                    !task.name || !Array.isArray(task.formFields)
                )
            )
        )
      ) {
        throw new Error('Invalid build structure');
      }

      switchBuild(loadedBuild); 
    } catch (error) {
      console.error('Failed to load JSON:', error);
      alert('Failed to load JSON. Please provide a valid build file.');
    }
  };

  return (
    <div className="container">
      {message && (
      <div className="alert-message" style={message.style}>
        {message.text}
      </div>
    )};
      {build.name === 'Demo Build' && renderConditions()}
      <div className="actions">
        <button onClick={saveBuildAsJSON} className="save-button">Save</button>
        <button className="upload-button">
          Load
          <input
            id="load-build"
            type="file"
            accept="application/json"
            onChange={loadBuildFromJSON}
            style={{
              opacity: 0,
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              cursor: 'pointer',
            }}
          />
        </button>
      </div>
      <label htmlFor="build-selector">Switch Build: </label>
      <select id="build-selector" onChange={handleSwitchBuild}>
        <option value="sampleBuild">Sample Build</option>
        <option value="testBuild">Test Build</option>
      </select>
      <h1 data-testid="build-status">{build.name} - Status: {build.status}</h1>
      <h2
        onClick={toggleBuild}
        id="build-level"
        className="expandable"
        data-testid="build-form-fields"
      >
        {build.name} - Form Fields {buildExpanded ? '▼' : '▶'}
      </h2>
      {buildExpanded && renderFormFields(build.formFields)}
      {build.components.map((component) => {
        //console.log('[APP] Rendering Component:', component.name); //debugging log
        const componentVisible = isVisible(component, build);
        if (!componentVisible) {
          //console.log('[APP] Component not visible:', component.name); //debugging log
          return null;
        }
  
        const isComponentExpanded = expandedComponents[component.id] || false;
  
        return (
          <div
            key={component.id}
            data-testid={`component-${component.name.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <h2
              onClick={() => toggleComponent(component.id)}
              id={`component-${component.id}`}
              className="expandable"
            >
              {component.name} - Status: {component.status} ({getImmediateChildStatusSummary(component.taskGroups)})
              {isComponentExpanded ? ' ▼' : ' ▶'}
            </h2>
            {isComponentExpanded && renderFormFields(component.formFields, { componentId: component.id })}
            {isComponentExpanded &&
  component.taskGroups.map((taskGroup) => {
    const taskGroupVisible = isVisible(taskGroup, build);
    //console.log(`[APP] Rendering Task Group: ${taskGroup.name}, Visible: ${taskGroupVisible}`); //debugging log
    if (!taskGroupVisible) return null;

    const taskGroupTestId = `task-group-${component.name.toLowerCase().replace(/\s+/g, '-')}-${taskGroup.name.toLowerCase().replace(/\s+/g, '-')}`;
    const isTaskGroupExpanded = expandedTaskGroups[taskGroup.id] || false;
    //console.log('[APP] Final Expanded Components State:', expandedComponents); //debugging log
    //console.log('[APP] Final Expanded Task Groups State:', expandedTaskGroups); //debugging log
    //console.log('[APP] Build Data:', build); //debugging log


    return (
      <div key={taskGroup.id} data-testid={taskGroupTestId} style={{ marginLeft: '20px' }}>
        <h3
          onClick={() => toggleTaskGroup(taskGroup.id)}
          id={`taskGroup-${taskGroup.id}`}
          className="expandable"
        >
          {taskGroup.name} - Status: {taskGroup.status} ({getImmediateChildStatusSummary(taskGroup.tasks)})
          {isTaskGroupExpanded ? ' ▼' : ' ▶'}
        </h3>
        {isTaskGroupExpanded &&
          taskGroup.tasks.map((task) => {
            const taskVisible = isVisible(task, build);
            const taskReadOnly = isReadOnly(task, build);
            //console.log(`[APP] Rendering Task: ${task.name}, Visible: ${taskVisible}`); //debugging log
            if (!taskVisible) return null;

            const taskTestId = `task-${component.name.toLowerCase().replace(/\s+/g, '-')}-${taskGroup.name.toLowerCase().replace(/\s+/g, '-')}-${task.name.toLowerCase().replace(/\s+/g, '-')}`;

            return (
              <div key={task.id} className="task" data-testid={taskTestId}>
                <p>
                  {task.name} - Status: {task.status}
                </p>
                <div>
                  <button
                    onClick={() => updateTaskStatus(component.id, taskGroup.id, task.id, 'pending')}
                    disabled={taskReadOnly}
                  >
                    Set Pending
                  </button>
                  <button
                    onClick={() => updateTaskStatus(component.id, taskGroup.id, task.id, 'in-progress')}
                    disabled={taskReadOnly}
                  >
                    Set In Progress
                  </button>
                  <button
                    onClick={() => updateTaskStatus(component.id, taskGroup.id, task.id, 'complete')}
                    disabled={taskReadOnly}
                  >
                    Set Complete
                  </button>
                </div>
                {renderFormFields(task.formFields, {
                  componentId: component.id,
                  taskGroupId: taskGroup.id,
                  taskId: task.id,
                })}
              </div>
            );
          })}
      </div>
    );
  })}

          </div>
        );
      })}
    </div>
  )};
  

export default App

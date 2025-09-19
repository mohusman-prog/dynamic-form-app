import React, { useState, useEffect, useReducer } from 'react';

// Form configuration
const formConfig = [
  { id: 'name', type: 'text', label: 'Name', required: true },
  { id: 'email', type: 'email', label: 'Email', required: true },
  { id: 'age', type: 'number', label: 'Age', required: false, min: 18 },
  { id: 'gender', type: 'select', label: 'Gender', required: true, options: ['Male', 'Female', 'Other'] },
  { id: 'role', type: 'radio', label: 'Role', required: true, options: ['Developer', 'Designer', 'Manager'] },
  { id: 'skills', type: 'checkbox', label: 'Skills', required: true, options: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js'] }
];

// Redux-like reducer for managing submissions
const submissionsReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_SUBMISSION':
      return [...state, action.payload];
    case 'LOAD_SUBMISSIONS':
      return action.payload;
    default:
      return state;
  }
};

// Validation functions
const validateField = (field, value) => {
  if (field.required && (!value || (Array.isArray(value) && value.length === 0))) {
    return `${field.label} is required`;
  }
  
  if (field.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return 'Please enter a valid email address';
    }
  }
  
  if (field.type === 'number' && value && field.min && parseInt(value) < field.min) {
    return `${field.label} must be at least ${field.min}`;
  }
  
  return '';
};

// Dynamic Form Component
const DynamicForm = ({ onSubmit, onNavigateToSubmissions }) => {
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const handleInputChange = (fieldId, value) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    
    // Real-time validation
    const field = formConfig.find(f => f.id === fieldId);
    const error = validateField(field, value);
    setErrors(prev => ({ ...prev, [fieldId]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors = {};
    formConfig.forEach(field => {
      const error = validateField(field, formData[field.id]);
      if (error) newErrors[field.id] = error;
    });
    
    setErrors(newErrors);
    
    // If no errors, submit the form
    if (Object.keys(newErrors).length === 0) {
      const submission = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        data: { ...formData }
      };
      
      onSubmit(submission);
      setFormData({});
      setErrors({});
    }
  };

  const renderField = (field) => {
    const hasError = errors[field.id];
    const fieldStyle = {
      marginBottom: '20px'
    };

    const labelStyle = {
      display: 'block',
      marginBottom: '5px',
      fontWeight: 'bold',
      color: '#333'
    };

    const inputStyle = {
      width: '100%',
      padding: '10px',
      border: hasError ? '2px solid #e74c3c' : '2px solid #ddd',
      borderRadius: '4px',
      fontSize: '16px',
      boxSizing: 'border-box'
    };

    const errorStyle = {
      color: '#e74c3c',
      fontSize: '14px',
      marginTop: '5px'
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
        return (
          <div key={field.id} style={fieldStyle}>
            <label style={labelStyle}>
              {field.label} {field.required && <span style={{color: '#e74c3c'}}>*</span>}
            </label>
            <input
              type={field.type}
              value={formData[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              style={inputStyle}
              min={field.min}
            />
            {hasError && <div style={errorStyle}>{hasError}</div>}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} style={fieldStyle}>
            <label style={labelStyle}>
              {field.label} {field.required && <span style={{color: '#e74c3c'}}>*</span>}
            </label>
            <select
              value={formData[field.id] || ''}
              onChange={(e) => handleInputChange(field.id, e.target.value)}
              style={inputStyle}
            >
              <option value="">Select {field.label}</option>
              {field.options.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
            {hasError && <div style={errorStyle}>{hasError}</div>}
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} style={fieldStyle}>
            <label style={labelStyle}>
              {field.label} {field.required && <span style={{color: '#e74c3c'}}>*</span>}
            </label>
            <div>
              {field.options.map(option => (
                <label key={option} style={{display: 'block', marginBottom: '8px', fontWeight: 'normal'}}>
                  <input
                    type="radio"
                    name={field.id}
                    value={option}
                    checked={formData[field.id] === option}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    style={{marginRight: '8px'}}
                  />
                  {option}
                </label>
              ))}
            </div>
            {hasError && <div style={errorStyle}>{hasError}</div>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} style={fieldStyle}>
            <label style={labelStyle}>
              {field.label} {field.required && <span style={{color: '#e74c3c'}}>*</span>}
            </label>
            <div>
              {field.options.map(option => (
                <label key={option} style={{display: 'block', marginBottom: '8px', fontWeight: 'normal'}}>
                  <input
                    type="checkbox"
                    value={option}
                    checked={(formData[field.id] || []).includes(option)}
                    onChange={(e) => {
                      const currentValues = formData[field.id] || [];
                      const newValues = e.target.checked
                        ? [...currentValues, option]
                        : currentValues.filter(v => v !== option);
                      handleInputChange(field.id, newValues);
                    }}
                    style={{marginRight: '8px'}}
                  />
                  {option}
                </label>
              ))}
            </div>
            {hasError && <div style={errorStyle}>{hasError}</div>}
          </div>
        );

      default:
        return null;
    }
  };

  const isFormValid = 
    formConfig.every(field => {
      if (!field.required) return true;
      const value = formData[field.id];
      return value && (Array.isArray(value) ? value.length > 0 : true);
    });

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>Dynamic Form Builder</h1>
        <button
          onClick={onNavigateToSubmissions}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          View Submissions
        </button>
      </div>
      
      <form onSubmit={handleSubmit} style={{ backgroundColor: 'white', padding: '30px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
        {formConfig.map(renderField)}
        
        <button
          type="submit"
          disabled={!isFormValid}
          style={{
            width: '100%',
            padding: '15px',
            backgroundColor: isFormValid ? '#27ae60' : '#bdc3c7',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '18px',
            cursor: isFormValid ? 'pointer' : 'not-allowed',
            marginTop: '20px'
          }}
        >
          Submit Form
        </button>
      </form>
    </div>
  );
};

// Submissions Display Component
const SubmissionsDisplay = ({ submissions, onBackToForm }) => {
  const containerStyle = {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  };

  const thStyle = {
    backgroundColor: '#34495e',
    color: 'white',
    padding: '15px',
    textAlign: 'left',
    fontWeight: 'bold'
  };

  const tdStyle = {
    padding: '12px 15px',
    borderBottom: '1px solid #ecf0f1'
  };

  if (submissions.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#2c3e50', margin: 0 }}>Form Submissions</h1>
          <button
            onClick={onBackToForm}
            style={{
              padding: '10px 20px',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Back to Form
          </button>
        </div>
        <div style={{ textAlign: 'center', padding: '50px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ color: '#7f8c8d' }}>No submissions yet.</h3>
          <p style={{ color: '#95a5a6' }}>Submit the form to see data here.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>Form Submissions ({submissions.length})</h1>
        <button
          onClick={onBackToForm}
          style={{
            padding: '10px 20px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          Back to Form
        </button>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>Submitted At</th>
              {formConfig.map(field => (
                <th key={field.id} style={thStyle}>{field.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission, index) => (
              <tr key={submission.id} style={{ backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white' }}>
                <td style={tdStyle}>{submission.id}</td>
                <td style={tdStyle}>{new Date(submission.timestamp).toLocaleString()}</td>
                {formConfig.map(field => (
                  <td key={field.id} style={tdStyle}>
                    {Array.isArray(submission.data[field.id]) 
                      ? submission.data[field.id].join(', ')
                      : submission.data[field.id] || '-'
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  const [submissions, dispatch] = useReducer(submissionsReducer, []);
  const [currentView, setCurrentView] = useState('form'); // 'form' or 'submissions'

  // Load submissions from localStorage on component mount
  useEffect(() => {
    const savedSubmissions = JSON.parse(localStorage.getItem('formSubmissions') || '[]');
    dispatch({ type: 'LOAD_SUBMISSIONS', payload: savedSubmissions });
  }, []);

  // Save submissions to localStorage whenever submissions change
  useEffect(() => {
    localStorage.setItem('formSubmissions', JSON.stringify(submissions));
  }, [submissions]);

  const handleFormSubmit = (submission) => {
    dispatch({ type: 'ADD_SUBMISSION', payload: submission });
    // Redirect to submissions page after successful submission
    setCurrentView('submissions');
  };

  const appStyle = {
    minHeight: '100vh',
    backgroundColor: '#f5f6fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  };

  return (
    <div style={appStyle}>
      {currentView === 'form' ? (
        <DynamicForm 
          onSubmit={handleFormSubmit}
          onNavigateToSubmissions={() => setCurrentView('submissions')}
        />
      ) : (
        <SubmissionsDisplay 
          submissions={submissions}
          onBackToForm={() => setCurrentView('form')}
        />
      )}
    </div>
  );
};

export default App;
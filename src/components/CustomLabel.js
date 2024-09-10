// src/components/CustomLabel.js
import React from 'react';

const CustomLabel = ({ label }) => (
  <div style={{
    backgroundColor: 'black', // Black background for contrast
    color: 'yellow', // Yellow text color
    fontWeight: 'bold',
    padding: '4px',
    borderRadius: '4px',
    fontSize: '12px',
    whiteSpace: 'nowrap', // Prevent line breaks
    textAlign: 'center', // Center the text
    transform: 'translate(-50%, 1px)', // Adjust the vertical position below the marker
    position: 'absolute',
    top: '100%', // Align to the bottom of the marker
    left: '50%' // Center horizontally
  }}>
    {label}
  </div>
);

export default CustomLabel;

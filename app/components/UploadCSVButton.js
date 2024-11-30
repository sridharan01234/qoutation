// components/UploadCSVButton.js
import React from 'react';

const UploadCSVButton = () => {
  const handleFileUpload = () => {
    // Handle file upload logic
  };

  return (
    <input type="file" onChange={handleFileUpload} />
  );
};

export default UploadCSVButton;

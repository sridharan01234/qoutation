// components/QuotationRequest.js
import React, { useState } from 'react';

const QuotationRequest = () => {
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = () => {
    // Handle submission logic
  };

  return (
    <div>
      <h2>Quotation Request</h2>
      {/* QuotationForm component */}
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleSubmit}>Submit Quotation</button>
    </div>
  );
};

export default QuotationRequest;

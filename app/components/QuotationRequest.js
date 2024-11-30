// components/QuotationRequest.js
import React, { useState } from 'react';

const QuotationRequest = () => {
  const [files, setFiles] = useState(null);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(e.target.files);
    }
  };

  const handleSubmit = () => {
    if (files && files.length > 0) {
      // Create FormData and append files
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('files', file);
      });

      // Log selected files (replace with your submission logic)
      console.log('Files to upload:', Array.from(files).map(f => f.name));
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quotation Request</h2>
      
      {/* File Upload Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                PDF, DOC, DOCX or images (MAX. 10MB each)
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              multiple
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,image/*"
            />
          </label>
        </div>

        {/* Selected Files List */}
        {files && files.length > 0 && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h3>
            <div className="space-y-2">
              {Array.from(files).map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-gray-700">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      const dt = new DataTransfer();
                      Array.from(files)
                        .filter((_, i) => i !== index)
                        .forEach(file => dt.items.add(file));
                      setFiles(dt.files);
                    }}
                    className="text-red-500 hover:text-red-700"
                    type="button"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!files || files.length === 0}
          className={`w-full py-2 px-4 rounded-md text-white font-medium
            ${files && files.length > 0
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
            } transition-colors duration-200`}
        >
          {files && files.length > 0
            ? `Submit Quotation (${files.length} ${files.length === 1 ? 'file' : 'files'})`
            : 'Select files to submit'
          }
        </button>
      </div>
    </div>
  );
};

export default QuotationRequest;
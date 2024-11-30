import React, { useState, useEffect } from 'react';

const QuotationRequest = () => {
  const [files, setFiles] = useState(null);
  const [previews, setPreviews] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      setFiles(e.target.files);
      
      // Create previews for images
      const previewUrls = [];
      Array.from(e.target.files).forEach(file => {
        if (file.type.startsWith('image/')) {
          const url = URL.createObjectURL(file);
          previewUrls.push(url);
        }
      });
      setPreviews(previewUrls);
    }
  };

  // Cleanup previews when component unmounts
  useEffect(() => {
    return () => {
      previews.forEach(URL.revokeObjectURL);
    };
  }, [previews]);

  return (
    <div className="space-y-4">
      {/* File Input */}
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
              PDF, DOC, DOCX (MAX. 10MB)
            </p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            onChange={handleFileChange}
            multiple
            accept=".pdf,.doc,.docx,image/*"
          />
        </label>
      </div>

      {/* File List */}
      {files && (
        <div className="bg-white rounded-lg shadow p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Selected Files:</h4>
          <div className="space-y-3">
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
                    const newFiles = Array.from(files).filter((_, i) => i !== index);
                    const dt = new DataTransfer();
                    newFiles.forEach(file => dt.items.add(file));
                    setFiles(dt.files);
                  }}
                  className="text-red-500 hover:text-red-700"
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

      {/* Image Previews */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuotationRequest;

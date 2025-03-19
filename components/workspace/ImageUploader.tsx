'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useGenerator } from '@/lib/context';
import Button from '../ui/Button';

export default function ImageUploader() {
  const { uploadImage, error } = useGenerator();
  const [isUploading, setIsUploading] = useState(false);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setIsUploading(true);
      uploadImage(acceptedFiles[0])
        .finally(() => setIsUploading(false));
    }
  }, [uploadImage]);
  
  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false,
    disabled: isUploading
  });
  
  // Determine the appropriate border color based on drag state
  const getBorderColor = () => {
    if (isDragAccept) return 'border-green-500 bg-green-50';
    if (isDragReject) return 'border-red-500 bg-red-50';
    if (isDragActive) return 'border-primary-500 bg-primary-50';
    return 'border-gray-300 hover:border-primary-400';
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-6 w-full h-full animate-fade-in">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 w-full h-full
          transition-all duration-300 ease-in-out
          flex flex-col items-center justify-center space-y-4
          ${getBorderColor()}
          ${isUploading ? 'opacity-50 cursor-wait' : 'opacity-100 cursor-pointer'}
          transform hover:scale-[1.01] active:scale-[0.99]
        `}
      >
        <input {...getInputProps()} />
        <div className={`text-center transition-transform duration-300 ${isDragActive ? 'scale-110' : 'scale-100'}`}>
          <svg
            className={`mx-auto h-12 w-12 transition-colors duration-300 ${
              isDragActive ? 'text-primary-500' : 
              isDragAccept ? 'text-green-500' : 
              isDragReject ? 'text-red-500' : 
              'text-gray-400'
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          
          <h3 className="mt-2 text-sm font-medium text-gray-900 transition-all duration-300">
            {isDragActive ? 'Drop the image here' : 
             isDragAccept ? 'Drop to upload' :
             isDragReject ? 'Unsupported file type' :
             isUploading ? 'Uploading...' : 'Drag and drop a product image'}
          </h3>
          <p className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
        </div>
        
        <Button 
          type="button" 
          variant="outline" 
          size="sm"
          disabled={isUploading}
          className={`transition-all duration-300 ${isUploading ? 'opacity-50' : 'opacity-100'}`}
        >
          {isUploading ? 'Uploading...' : 'Select from computer'}
        </Button>

        {isUploading && (
          <div className="mt-2 animate-pulse-subtle">
            <div className="w-8 h-8 border-2 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
          </div>
        )}
      </div>
      
      {error && (
        <p className="mt-2 text-sm text-red-600 animate-fade-in">
          {error}
        </p>
      )}
    </div>
  );
}

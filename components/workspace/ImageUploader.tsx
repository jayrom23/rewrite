'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useGenerator } from '@/lib/context';
import Button from '../ui/Button';

export default function ImageUploader() {
  const { uploadImage, error } = useGenerator();
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      uploadImage(acceptedFiles[0]);
    }
  }, [uploadImage]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });
  
  return (
    <div className="flex flex-col items-center justify-center p-6 w-full h-full">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 w-full h-full
          transition-colors duration-200 ease-in-out
          flex flex-col items-center justify-center space-y-4
          ${isDragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-primary-400'}
        `}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
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
          
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {isDragActive ? 'Drop the image here' : 'Drag and drop a product image'}
          </h3>
          <p className="mt-1 text-xs text-gray-500">PNG, JPG, WEBP up to 10MB</p>
        </div>
        
        <Button type="button" variant="outline" size="sm">
          Select from computer
        </Button>
      </div>
      
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}

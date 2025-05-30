
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/api';
import LoadingSpinner from './LoadingSpinner';

interface FileUploadProps {
  onUploadSuccess?: (datasetId: string) => void;
}

const FileUpload = ({ onUploadSuccess }: FileUploadProps) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadMessage, setUploadMessage] = useState<string>('');

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setUploadedFile(acceptedFiles[0]);
      setUploadStatus('idle');
      setUploadMessage('');
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/vnd.ms-excel': ['.xlsx'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    maxFiles: 1,
    maxSize: 50 * 1024 * 1024, // 50MB
  });

  const handleUpload = async () => {
    if (!uploadedFile) return;

    setUploadStatus('uploading');
    setUploadMessage('Uploading and processing your dataset...');

    try {
      const result = await apiService.uploadDataset(uploadedFile);
      setUploadStatus('success');
      setUploadMessage(result.message);
      if (onUploadSuccess) {
        onUploadSuccess(result.datasetId);
      }
    } catch (error) {
      setUploadStatus('error');
      setUploadMessage(error instanceof Error ? error.message : 'Upload failed');
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadStatus('idle');
    setUploadMessage('');
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <File className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusColor = () => {
    switch (uploadStatus) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload Custom Dataset
        </CardTitle>
        <CardDescription>
          Upload your own gene expression data (CSV/Excel format)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!uploadedFile ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-blue-600">Drop your file here...</p>
            ) : (
              <div>
                <p className="text-gray-600 mb-2">
                  Drag & drop your dataset file here, or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports CSV and Excel files (max 50MB)
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className={`p-4 rounded-lg border ${getStatusColor()}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getStatusIcon()}
                <div>
                  <p className="font-medium text-sm">{uploadedFile.name}</p>
                  <p className="text-xs text-gray-500">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <Badge variant="outline">
                  {uploadedFile.type.includes('csv') ? 'CSV' : 'Excel'}
                </Badge>
              </div>
              {uploadStatus !== 'uploading' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={removeFile}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {uploadMessage && (
              <p className={`mt-2 text-sm ${
                uploadStatus === 'error' ? 'text-red-600' : 
                uploadStatus === 'success' ? 'text-green-600' : 'text-blue-600'
              }`}>
                {uploadMessage}
              </p>
            )}

            {uploadStatus === 'uploading' && (
              <div className="mt-4">
                <LoadingSpinner size="sm" message="Processing your dataset..." />
              </div>
            )}

            {uploadStatus === 'idle' && (
              <div className="mt-4 flex gap-2">
                <Button onClick={handleUpload} className="flex-1">
                  Upload & Process
                </Button>
                <Button variant="outline" onClick={removeFile}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium text-sm mb-2">Expected Format:</h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li>• First column: Gene symbols/IDs</li>
            <li>• Subsequent columns: Sample expression values</li>
            <li>• Header row with sample names</li>
            <li>• Numeric expression values only</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUpload;

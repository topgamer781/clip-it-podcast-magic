import React, { useState, useRef, useEffect } from 'react';
import { Progress } from "./ui/progress";
import { toast } from "./ui/use-toast";
import { Card } from "./ui/card";
import { FileVideo, Upload, AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "./ui/button";

interface S3FileUploaderProps {
  onUploadComplete: (videoId: string, s3Key: string, filename: string) => void;
  apiBaseUrl?: string;
  onStartProcessing?: (videoId: string, s3Key: string) => void;
}

const S3FileUploader: React.FC<S3FileUploaderProps> = ({ 
  onUploadComplete, 
  apiBaseUrl = 'https://e2wrar6rqxe20e-8000.proxy.runpod.net/',
  onStartProcessing
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploadedInfo, setUploadedInfo] = useState<{videoId: string, s3Key: string} | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset function to clear states for a new upload
  const resetUploadState = () => {
    setUploading(false);
    setProgress(0);
    setUploadError(null);
  };

  // Reset function for complete reset (on errors or to start fresh)
  const resetCompleteState = () => {
    setFile(null);
    setUploading(false);
    setProgress(0);
    setUploadError(null);
    setUploadedInfo(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Automatically start upload when a file is selected
  useEffect(() => {
    if (file && !uploading && !uploadedInfo) {
      handleUpload();
    }
  }, [file]);

  // Automatically start processing after upload is complete
  useEffect(() => {
    if (uploadedInfo && onStartProcessing) {
      // Short delay before starting processing to allow UI to update
      const timer = setTimeout(() => {
        onStartProcessing(uploadedInfo.videoId, uploadedInfo.s3Key);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [uploadedInfo]);//, onStartProcessing]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Reset any previous error states
    resetUploadState();
    
    const selectedFile = e.target.files?.[0] || null;
    if (selectedFile) {
      setFile(selectedFile);
      // Upload will start automatically via useEffect
    }
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    // Reset any previous error states
    resetUploadState();
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      setFile(droppedFile);
      // Upload will start automatically via useEffect
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive"
      });
      return;
    }

    try {
      setUploading(true);
      setProgress(0);
      setUploadError(null);

      const presignedResponse = await fetch(`${apiBaseUrl}/s3-upload-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filename: file.name,
          content_type: file.type
        })
      });

      if (!presignedResponse.ok) {
        throw new Error('Failed to get upload URL');
      }

      const { upload_url, upload_fields, video_id, s3_key } = await presignedResponse.json();

      const formData = new FormData();
      
      // Add all fields from the presigned post
      Object.entries(upload_fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      
      // Add the file last
      formData.append('file', file);

      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const percentComplete = Math.round((event.loaded / event.total) * 100);
          setProgress(percentComplete);
        }
      });

      xhr.addEventListener('load', async () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const registerResponse = await fetch(`${apiBaseUrl}/register-s3-upload`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: new URLSearchParams({
                video_id,
                s3_key,
                filename: file.name
              })
            });

            if (!registerResponse.ok) {
              throw new Error('Failed to register upload');
            }

            setUploading(false);
            setProgress(100);
            setUploadError(null);
            
            toast({
              title: "Upload complete",
              description: "Your file has been uploaded successfully",
            });
            
            setUploadedInfo({
              videoId: video_id,
              s3Key: s3_key
            });
            
            // Reset file input but keep the current file for display purposes
            if (fileInputRef.current) {
              fileInputRef.current.value = '';
            }
            
            // Notify parent component
            onUploadComplete(video_id, s3_key, file.name);
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : "Failed to register upload";
            setUploadError(errorMsg);
            throw new Error(errorMsg);
          }
        } else {
          const errorMsg = `Upload failed with status ${xhr.status}`;
          setUploadError(errorMsg);
          throw new Error(errorMsg);
        }
      });

      xhr.addEventListener('error', () => {
        const errorMsg = "Network error during upload";
        setUploadError(errorMsg);
        setUploading(false);
        setFile(null);
        
        toast({
          title: "Upload failed",
          description: errorMsg,
          variant: "destructive"
        });
      });

      xhr.addEventListener('abort', () => {
        setUploadError("Upload aborted");
        setUploading(false);
      });

      xhr.open('POST', upload_url, true);
      xhr.send(formData);
      
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "There was an error uploading your file";
      setUploadError(errorMsg);
      setUploading(false);
      
      toast({
        title: "Upload failed",
        description: errorMsg,
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="p-6 S3FileUploader">
      <div className="flex flex-col space-y-4">
        <div 
          className={`flex items-center justify-center border-2 border-dashed rounded-lg p-6 transition-colors duration-200 ${
            dragActive ? 'border-blue-500 bg-blue-50' : 
            uploadError ? 'border-red-300 bg-red-50' : 
            uploadedInfo ? 'border-green-300 bg-green-50' :
            'border-gray-300 hover:border-blue-400 hover:bg-blue-50/30'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => {
            if (!uploading && !uploadedInfo) {
              fileInputRef.current?.click();
            }
          }}
        >
          <div className="flex flex-col items-center">
            {uploading ? (
              <>
                <Upload className="w-12 h-12 text-blue-500 animate-pulse" />
                <span className="mt-2 text-base font-medium">Uploading...</span>
                <div className="w-full mt-4 max-w-[200px]">
                  <Progress value={progress} className="h-2" />
                  <div className="text-sm text-center text-gray-500 mt-1">
                    {progress}% uploaded
                  </div>
                </div>
              </>
            ) : uploadError ? (
              <>
                <AlertCircle className="w-12 h-12 text-red-500" />
                <span className="mt-2 text-base font-medium text-red-500">Upload Failed</span>
                <span className="mt-1 text-sm text-gray-500 text-center max-w-[250px]">
                  {uploadError}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    resetCompleteState();
                  }}
                >
                  Try Again
                </Button>
              </>
            ) : file && uploadedInfo ? (
              <>
                <CheckCircle2 className="w-12 h-12 text-green-500" />
                <span className="mt-2 text-base font-medium">{file.name}</span>
                <span className="mt-1 text-sm text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
                <span className="mt-1 text-xs text-green-600 font-medium">
                  Upload Complete - Processing Started
                </span>
              </>
            ) : file ? (
              <>
                <FileVideo className="w-12 h-12 text-blue-500" />
                <span className="mt-2 text-base font-medium">{file.name}</span>
                <span className="mt-1 text-sm text-gray-500">
                  {(file.size / (1024 * 1024)).toFixed(2)} MB
                </span>
              </>
            ) : (
              <>
                <FileVideo className="w-12 h-12 text-gray-400" />
                <div className="flex flex-col items-center text-center">
                  <span className="mt-2 text-base">
                    Select a video file
                  </span>
                  <span className="mt-1 text-sm text-gray-500">
                    MP4, MOV up to 5GB
                  </span>
                  <span className="mt-2 text-xs text-gray-400">
                    Click or drag and drop
                  </span>
                </div>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept="video/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default S3FileUploader; 
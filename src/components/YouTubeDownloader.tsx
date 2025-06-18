import React, { useState, useEffect } from 'react';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";
import { Youtube, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "./ui/use-toast";
import axios from 'axios';

interface YouTubeDownloaderProps {
  onDownloadComplete: (videoId: string, taskId: string) => void;
  apiBaseUrl?: string;
  onStartProcessing?: (videoId: string, taskId: string) => void;
}

const YouTubeDownloader: React.FC<YouTubeDownloaderProps> = ({
  onDownloadComplete,
  apiBaseUrl = 'https://e2wrar6rqxe20e-8000.proxy.runpod.net',
  onStartProcessing
}) => {
  const [url, setUrl] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [autoProcess, setAutoProcess] = useState(true);
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadStatus, setDownloadStatus] = useState<string>('');

  // Clean up polling when component unmounts
  useEffect(() => {
    let pollTimer: NodeJS.Timeout | null = null;
    
    return () => {
      // Clear any active polling timers when the component unmounts
      if (pollTimer) {
        clearTimeout(pollTimer);
      }
    };
  }, []);

  // Validate YouTube URL
  const validateYouTubeUrl = (url: string) => {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})(\S*)?$/;
    return youtubeRegex.test(url);
  };

  // Handle URL input change
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputUrl = e.target.value;
    setUrl(inputUrl);
    setIsValidUrl(validateYouTubeUrl(inputUrl));
    setDownloadError(null);
  };

  // Handle download button click
  const handleDownload = async () => {
    if (!isValidUrl) {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube video URL",
        variant: "destructive"
      });
      return;
    }

    try {
      setDownloading(true);
      setDownloadError(null);

      const response = await axios.post(`${apiBaseUrl}/youtube-download`, {
        url: url,
        auto_process: autoProcess
      });

      if (response.data) {
        setTaskId(response.data.task_id);
        setVideoId(response.data.video_id);
        
        // Start polling for status
        pollDownloadStatus(response.data.task_id);
        
        toast({
          title: "Download started",
          description: "YouTube video download has started"
        });
      }
    } catch (error) {
      console.error("Error downloading YouTube video:", error);
      setDownloading(false);
      setDownloadError("Failed to start download. Please check the URL and try again.");
      
      toast({
        title: "Download failed",
        description: "Failed to start YouTube download",
        variant: "destructive"
      });
    }
  };

  // Poll for download status with improved debugging
  const pollDownloadStatus = async (taskId: string) => {
    try {
      console.log(`Polling status for task ${taskId}...`);
      const response = await axios.get(`${apiBaseUrl}/status/${taskId}`);
      
      if (response.data) {
        const status = response.data.status;
        const progress = response.data.progress || 0;
        const message = response.data.message || '';
        const processTaskId = response.data.process_task_id;
        const videoId = response.data.video_info?.video_id;
        
        // Update status and progress
        setDownloadStatus(status);
        setDownloadProgress(progress);
        
        console.log(`Status update for task ${taskId}:`, {
          status,
          progress,
          message,
          processTaskId,
          videoId,
          fullResponse: response.data
        });
        
        if (status === "downloaded") {
          setDownloading(false);
          
          toast({
            title: "Download complete",
            description: "YouTube video has been downloaded successfully"
          });
          
          if (videoId) {
            // Call the completion handler
            onDownloadComplete(videoId, taskId);
            
            // Check if processing has started using the new endpoint
            try {
              console.log(`Checking if processing has started for video ${videoId}`);
              const processingStatusResponse = await axios.get(`${apiBaseUrl}/processing-status/${videoId}`);
              
              if (processingStatusResponse.data && processingStatusResponse.data.has_processing_started) {
                console.log(`Processing has started for video ${videoId}, status: ${processingStatusResponse.data.status}`);
                
                // If processing has started, poll the process task ID
                if (processingStatusResponse.data.process_task_id) {
                  console.log(`Switching to poll process task ID: ${processingStatusResponse.data.process_task_id}`);
                  setTimeout(() => pollDownloadStatus(processingStatusResponse.data.process_task_id), 1000);
                  return;
                }
              } else {
                console.log(`Processing has not started yet for video ${videoId}, continuing to poll original task`);
              }
            } catch (error) {
              console.error(`Error checking processing status for video ${videoId}:`, error);
              // Continue with normal flow
            }
          }
          
          // Check if processing has already started
          if (processTaskId) {
            console.log(`Task ${taskId} has process_task_id ${processTaskId}, switching to polling that task`);
            setTimeout(() => pollDownloadStatus(processTaskId), 1000);
            return;
          }
          
          // If auto-processing is enabled, poll again after a short delay
          // to catch the transition to processing
          if (autoProcess) {
            console.log(`Task ${taskId} download complete, polling again in 1 second to check for processing status`);
            setTimeout(() => pollDownloadStatus(taskId), 1000);
            return;
          }
          
          return;
        } else if (status === "processing_started" || status === "queued" || status === "processing" || 
                  status === "transcribing" || status === "analyzing") {
          // Processing has started, show processing status
          setDownloading(true); // Keep the loading state active
          setDownloadStatus(status);
          setDownloadProgress(progress);
          
          // Switch to polling the process task ID if available
          if (processTaskId) {
            console.log(`Task ${taskId} has started processing with process_task_id ${processTaskId}, switching to polling that task`);
            setTimeout(() => pollDownloadStatus(processTaskId), 1000);
            return;
          } else {
            console.log(`Task ${taskId} has status ${status} but no process_task_id, continuing to poll current task`);
          }
        } else if (status === "completed") {
          setDownloading(false);
          
          toast({
            title: "Processing complete",
            description: "YouTube video has been processed successfully"
          });
          
          if (videoId) {
            // Call the completion handler with any clips data
            const clips = response.data.clips || [];
            onDownloadComplete(videoId, taskId);
          }
          
          return;
        } else if (status === "error") {
          setDownloading(false);
          
          // Extract and display a more user-friendly error message
          let errorMessage = response.data.message || "Download failed";
          if (errorMessage.includes("unavailable") || errorMessage.includes("private")) {
            errorMessage = "This video is unavailable or private";
          } else if (errorMessage.includes("age") && errorMessage.includes("restrict")) {
            errorMessage = "This video is age-restricted and cannot be downloaded";
          }
          
          setDownloadError(errorMessage);
          
          toast({
            title: "Download failed",
            description: errorMessage,
            variant: "destructive"
          });
          
          return;
        }
        
        // Continue polling if still in progress, with shorter interval for certain states
        const pollingInterval = ["downloading", "downloaded", "processing_started", "queued", 
                               "processing", "transcribing", "analyzing"].includes(status) ? 1000 : 2000;
        console.log(`Scheduling next poll for task ${taskId} in ${pollingInterval}ms`);
        const timer = setTimeout(() => pollDownloadStatus(taskId), pollingInterval);
        return timer;
      }
    } catch (error) {
      console.error(`Error checking status for task ${taskId}:`, error);
      setDownloading(false);
      setDownloadError("Failed to check download status");
    }
  };

  // Display the appropriate status message
  const getStatusMessage = () => {
    if (downloadStatus === "downloading") {
      return "Downloading video from YouTube...";
    } else if (downloadStatus === "transcribing") {
      return "Transcribing audio...";
    } else if (downloadStatus === "analyzing") {
      return "Analyzing content...";
    } else if (downloadStatus === "processing") {
      return "Processing video clips...";
    } else if (downloadStatus === "processing_started" || downloadStatus === "queued") {
      return "Starting processing...";
    } else {
      return "Downloading...";
    }
  };

  return (
    <Card className="p-6 border-2 border-dashed border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center mb-4">
        <Youtube className="w-6 h-6 mr-2 text-red-600" />
        <h3 className="text-lg font-medium">YouTube Downloader</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="youtube-url" className="block text-sm font-medium mb-1">
            YouTube Video URL
          </label>
          <Input
            id="youtube-url"
            placeholder="https://www.youtube.com/watch?v=..."
            value={url}
            onChange={handleUrlChange}
            disabled={downloading}
            className={`${!url || isValidUrl ? '' : 'border-red-500'}`}
          />
          {url && !isValidUrl && (
            <p className="mt-1 text-sm text-red-500">Please enter a valid YouTube URL</p>
          )}
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="auto-process"
            checked={autoProcess}
            onChange={() => setAutoProcess(!autoProcess)}
            disabled={downloading}
            className="mr-2"
          />
          <label htmlFor="auto-process" className="text-sm">
            Automatically process after download
          </label>
        </div>
        
        {downloadError && (
          <div className="flex items-center text-red-500 text-sm">
            <AlertCircle className="w-4 h-4 mr-1" />
            <span>{downloadError}</span>
          </div>
        )}
        
        {downloading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>{getStatusMessage()}</span>
              <span>{downloadProgress}%</span>
            </div>
            <Progress value={downloadProgress} className="h-2" />
          </div>
        )}
        
        <div className="flex justify-end">
          <Button
            onClick={handleDownload}
            disabled={!isValidUrl || downloading}
            className="bg-red-600 hover:bg-red-700"
          >
            {downloading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Downloading...
              </>
            ) : (
              <>
                <Youtube className="w-4 h-4 mr-2" />
                Download
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default YouTubeDownloader; 
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Upload, 
  Play, 
  Rocket, 
  FileUp,
  Mic,
  Headphones,
  Music,
  Video,
  Scissors,
  Sparkles,
  ArrowRight,
  Link,
  Share2,
  MoreHorizontal,
  Calendar,
  Clock,
  ChevronRight,
  PlayCircle,
  Download,
  X,
  Youtube
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import axios from "axios"; // Add axios for API calls
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import S3FileUploader from '../components/S3FileUploader';
import YouTubeDownloader from '../components/YouTubeDownloader';
import { InfoIcon } from "lucide-react";

// Add API base URL
const API_BASE_URL = "https://e2wrar6rqxe20e-8000.proxy.runpod.net"; // Adjust based on your backend URL

interface UploadItem {
  id: string;
  filename: string;
  uploadDate: string;
  status: string;
  s3Key?: string;
  taskId?: string;
}

const Dashboard = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [generatedClips, setGeneratedClips] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [taskId, setTaskId] = useState<string | null>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  // Add state for backend connection
  const [isConnectedToBackend, setIsConnectedToBackend] = useState(true);
  // Add a state for the preview modal
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewClip, setPreviewClip] = useState<any>(null);
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [processingVideo, setProcessingVideo] = useState<string | null>(null);
  const [activePollingInterval, setActivePollingInterval] = useState<NodeJS.Timeout | null>(null);
  // Add a new state for tracking connection attempts and connection status
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [statusPollingErrors, setStatusPollingErrors] = useState(0);
  const [processingStatus, setProcessingStatus] = useState<string | null>(null);
  const [processingMessage, setProcessingMessage] = useState<string | null>(null);
  const MAX_CONSECUTIVE_ERRORS = 5; // Max number of consecutive errors before showing connection error
  // Add a state to track completion status to prevent duplicate alerts
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set());
  // Add a state for the full-screen loading overlay
  const [showFullScreenLoading, setShowFullScreenLoading] = useState(false);
  const [uploadMethod, setUploadMethod] = useState<'s3' | 'youtube'>('s3');
  // Add a new state variable to track background processing
  const [backgroundProcessing, setBackgroundProcessing] = useState(false);

  // useEffect for cleanup when component unmounts
  useEffect(() => {
    // Cleanup function to clear any active intervals when component unmounts
    return () => {
      if (activePollingInterval) {
        clearInterval(activePollingInterval);
      }
    };
  }, [activePollingInterval]);

  // Update the useEffect for processing status to handle background processing
  useEffect(() => {
    // This effect handles success/error notifications to prevent duplicates
    if (!processingStatus || !taskId) return;

    console.log("Processing status changed:", processingStatus, "for task ID:", taskId);
    console.log("Completed task IDs:", Array.from(completedTaskIds));

    // Only show completion alert once per task
    if (processingStatus === "completed" && !completedTaskIds.has(taskId)) {
      console.log("Showing completion toast for task:", taskId);
      
      // Mark this task as completed
      setCompletedTaskIds(prev => {
        const newSet = new Set(prev);
        newSet.add(taskId);
        return newSet;
      });
      
      // Hide the full-screen loading overlay and reset background processing
      setShowFullScreenLoading(false);
      setBackgroundProcessing(false);
      
      // Show success toast only once
      toast({
        title: "Processing complete!",
        description: `${generatedClips.length} clips have been generated from your podcast.`,
      });
    }
    
    // Only show error alert once per task
    if (processingStatus === "error" && !completedTaskIds.has(taskId)) {
      console.log("Showing error toast for task:", taskId);
      
      // Mark this task as completed (with error)
      setCompletedTaskIds(prev => {
        const newSet = new Set(prev);
        newSet.add(taskId);
        return newSet;
      });
      
      // Hide the full-screen loading overlay and reset background processing
      setShowFullScreenLoading(false);
      setBackgroundProcessing(false);
      
      // Show error toast only once
      toast({
        title: "Processing failed",
        description: processingMessage || "There was an error processing your file.",
        variant: "destructive",
      });
    }
  }, [processingStatus, taskId, generatedClips.length, processingMessage, completedTaskIds, toast]);

  // Add function to check task status
  const checkTaskStatus = async (taskId: string) => {
    try {
      console.log(`Checking status for task: ${taskId}`);
      
      const response = await axios.get(`${API_BASE_URL}/status/${taskId}`, {
        timeout: 600 * 1000 // Set a reasonable timeout
      });
      
      // Reset error count on successful response
      setStatusPollingErrors(0);
      setIsConnectedToBackend(true);
      
      if (response.data) {
        console.log(`Received status response for task ${taskId}:`, response.data);
        
        // Update processing details
        setProcessingProgress(response.data.progress || 0);
        setProcessingStatus(response.data.status);
        setProcessingMessage(response.data.message || null);
        
        // Update taskId to ensure useEffect can detect changes
        setTaskId(taskId);
        
        // Check if this task has a process_task_id and we should switch to polling that instead
        if (response.data.process_task_id && 
            ["downloaded", "processing_started", "queued"].includes(response.data.status)) {
          console.log(`Task ${taskId} has process_task_id ${response.data.process_task_id}, will switch to polling that task`);
          // Return false to continue polling, but the calling function should switch to the process_task_id
          return {
            isComplete: false,
            shouldSwitchTask: true,
            newTaskId: response.data.process_task_id
          };
        }
        
        // Check if processing is complete or in error state
        if (response.data.status === "completed") {
          console.log(`Task ${taskId} is complete`);
          setIsProcessing(false);
          setBackgroundProcessing(false);
          if (response.data.clips) {
            console.log(`Task ${taskId} has ${response.data.clips.length} clips`);
            setGeneratedClips(response.data.clips.map((clip: any, index: number) => ({
              id: index + 1,
              title: clip.title || `Clip ${index + 1}`,
              duration: formatDuration(clip.end_time - clip.start_time),
              date: "Just now",
              thumbnail: clip.thumbnail_url || `https://via.placeholder.com/300x168/${getRandomColor()}/FFFFFF?text=Clip+${index+1}`,
              views: 0,
              engagement: "0%",
              template: "None",
              url: clip.url
            })));
          }
          
          return { isComplete: true };
        } else if (response.data.status === "error") {
          console.log(`Task ${taskId} has error: ${response.data.message}`);
          setIsProcessing(false);
          setBackgroundProcessing(false);
          return { isComplete: true };
        } else if (response.data.status === "downloading") {
          // Special handling for downloading status
          console.log(`Task ${taskId} is still downloading: ${response.data.progress}%`);
          setProcessingMessage(response.data.message || "Downloading file from S3...");
          // Keep polling - don't return true yet
        } else {
          console.log(`Task ${taskId} has status: ${response.data.status}, progress: ${response.data.progress}%`);
        }
      }
      return { isComplete: false };
    } catch (error) {
      console.error(`Status check error for task ${taskId}:`, error);
      
      // Increment error counter
      setStatusPollingErrors(prev => {
        const newCount = prev + 1;
        // Only set connection status to false after multiple consecutive errors
        if (newCount >= MAX_CONSECUTIVE_ERRORS) {
          setIsConnectedToBackend(false);
        }
        return newCount;
      });
      
      // Don't return true here to allow polling to continue
      return { isComplete: false };
    }
  };

  // Add function to format duration
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Add function to generate random color for thumbnails
  const getRandomColor = (): string => {
    const colors = ['6D28D9', '4F46E5', '9333EA', '8B5CF6', '7C3AED'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Add function to show notifications
  const showNotification = ({ title, message, type = "default" }: { title: string, message: string, type: "success" | "error" | "default" }) => {
      toast({
      title,
      description: message,
      variant: type === "error" ? "destructive" : "default",
      });
  };

  // Start processing for both regular and S3 uploads
  const startProcessing = async (videoId: string, s3Key?: string) => {
    try {
      setProcessingVideo(videoId);
      setBackgroundProcessing(true);
      
      // Different endpoint for S3-uploaded files
      const endpoint = s3Key 
        ? `${API_BASE_URL}/process-s3-video/${videoId}?s3_key=${s3Key}` 
        : `${API_BASE_URL}/process-video/${videoId}`;
      
      // const response = await fetch(endpoint, {
      //   method: 'POST',
      // });

      const response = await axios.post(endpoint, {
        timeout: 600 * 1000 // Set a reasonable timeout
      });
      
      if (!response.data) {
        throw new Error(`Processing failed with status ${response.data.status}`);
      }
      
      // const data = await response.data.json();
      // const data = response.data;
      
      // Update upload status and store task ID
      setUploads(uploads.map(upload => 
        upload.id === videoId 
          ? { ...upload, status: 'processing', taskId: response.data.task_id } 
          : upload
      ));
      
      // Show success notification
      showNotification({
        title: "Processing Started",
        message: `Your podcast is now being processed`,
        type: "success"
      });
      
      // Start polling for status
      pollTaskStatus(response.data.task_id);
      
    } catch (error) {
      console.error('Error starting processing:', error);
      showNotification({
        title: "Processing Failed",
        message: error instanceof Error ? error.message : "Failed to start processing",
        type: "error"
      });
    } finally {
      setProcessingVideo(null);
    }
  };

  const pollTaskStatus = async (id: string) => {
    console.log("Starting polling for task ID:", id);
    
    // Set the task ID in state to ensure useEffect works properly
    setTaskId(id);
    
    // Set initial polling state
    setIsProcessing(true);
    setBackgroundProcessing(true);
    setProcessingProgress(0);
    setStatusPollingErrors(0);
    
    // Show full-screen loading overlay
    setShowFullScreenLoading(true);
    
    // Clear any existing interval
    if (activePollingInterval) {
      clearInterval(activePollingInterval);
    }
    
    // Initial polling interval (3 seconds)
    let pollingInterval = 3000;
    let consecutiveErrors = 0;
    let currentTaskId = id;
    
    // Store the interval ID so we can clear it later
    const intervalId = setInterval(async () => {
      try {
        console.log(`Polling interval checking status for task: ${currentTaskId}`);
        
        // Call the existing checkTaskStatus function
        const result = await checkTaskStatus(currentTaskId);
        
        // If task is complete or failed, stop polling
        if (result.isComplete) {
          console.log(`Task ${currentTaskId} is complete, stopping polling`);
          clearInterval(intervalId);
          setActivePollingInterval(null);
          setIsProcessing(false);
          return;
        }
        
        // If we should switch to polling a different task ID
        if (result.shouldSwitchTask && result.newTaskId) {
          console.log(`Switching polling from task ${currentTaskId} to ${result.newTaskId}`);
          currentTaskId = result.newTaskId;
        }
        
        // Reset consecutive errors on success
        if (consecutiveErrors > 0) {
          consecutiveErrors = 0;
          // Reset to normal polling interval
          if (pollingInterval !== 3000) {
            console.log(`Resetting polling interval to 3000ms after successful response`);
            pollingInterval = 3000;
            clearInterval(intervalId);
            const newIntervalId = setInterval(pollFunction, pollingInterval);
            setActivePollingInterval(newIntervalId);
          }
        }
      } catch (error) {
        console.error(`Error polling task status for task ${currentTaskId}:`, error);
        
        // Count consecutive errors
        consecutiveErrors++;
        
        // Implement exponential backoff after multiple failures
        if (consecutiveErrors >= 3) {
          // Increase polling interval (max 15 seconds)
          const newInterval = Math.min(pollingInterval * 1.5, 15000);
          if (newInterval !== pollingInterval) {
            pollingInterval = newInterval;
            clearInterval(intervalId);
            const newIntervalId = setInterval(pollFunction, pollingInterval);
            setActivePollingInterval(newIntervalId);
            console.log(`Adjusted polling interval to ${pollingInterval}ms due to errors`);
          }
        }
        
        // Show error notification after multiple consecutive errors
        if (consecutiveErrors === MAX_CONSECUTIVE_ERRORS) {
          showNotification({
            title: "Connection Issues",
            message: "Having trouble connecting to the server. Will keep trying...",
            type: "error"
          });
        }
      }
    }, pollingInterval);
    
    // Create a reference to the polling function for interval adjustments
    const pollFunction = async () => {
      try {
        const result = await checkTaskStatus(currentTaskId);
        if (result.isComplete) {
          clearInterval(activePollingInterval!);
          setActivePollingInterval(null);
          setIsProcessing(false);
        }
        // If we should switch to polling a different task ID
        if (result.shouldSwitchTask && result.newTaskId) {
          console.log(`Switching polling from task ${currentTaskId} to ${result.newTaskId}`);
          currentTaskId = result.newTaskId;
        }
      } catch (error) {
        console.error(`Polling error for task ${currentTaskId}:`, error);
      }
    };
    
    // Save the interval ID to state for cleanup
    setActivePollingInterval(intervalId);
    
    return intervalId;
  };

  const exploreMoreTemplates = () => {
    navigate('/templates');
  };

  const templateTypes = [
    {
      name: "Emoji Reaction",
      description: "Add emoji reactions that viewers can tap",
      icon: "🎮 😂 ❤️ 🔥",
      popular: true
    },
    {
      name: "Quiz Show",
      description: "Create interactive quizzes based on your content",
      icon: "❓ 🎯 🏆",
      popular: false
    },
    {
      name: "Word Cloud",
      description: "Generate clickable keyword clouds",
      icon: "☁️ 📝 🔤",
      popular: false
    },
    {
      name: "Poll",
      description: "Let viewers vote on questions or options",
      icon: "🗳️ 📊 👍",
      popular: true,
      new: true
    },
    {
      name: "Tap Rhythm",
      description: "Music-synced tapping game",
      icon: "🎵 👆 🎶",
      popular: false,
      new: true
    },
    {
      name: "Quotes",
      description: "Highlight quotable moments with animations",
      icon: "💬 ✨ 📜",
      popular: true
    }
  ];

  const applyTemplateToClip = (clipId: number, templateName: string) => {
    setGeneratedClips(clips => 
      clips.map(clip => 
        clip.id === clipId 
          ? {...clip, template: templateName} 
          : clip
      )
    );
    
    toast({
      title: "Template Applied",
      description: `${templateName} template added to clip #${clipId}.`,
    });
  };

  // Add function to download clip
  const downloadClip = async (url: string) => {
    try {
      // Create a full URL if it's a relative path
      const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;
      
      // Show loading toast
      toast({
        title: "Starting download",
        description: "Preparing your clip for download...",
      });
      
      // Fetch the file
      const response = await fetch(fullUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Get the blob
      const blob = await response.blob();
      
      // Create a URL for the blob
      const blobUrl = URL.createObjectURL(blob);
      
      // Create a temporary anchor element
      const link = document.createElement('a');
      link.href = blobUrl;
      
      // Extract filename from URL or use a default name
      const filename = url.split('/').pop() || 'clip.mp4';
      link.download = filename;
      
      // Append to the document
      document.body.appendChild(link);
      
      // Trigger click
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      
      toast({
        title: "Download complete",
        description: "Your clip has been downloaded.",
      });
    } catch (error) {
      console.error("Download error:", error);
      toast({
        title: "Download failed",
        description: "There was an error downloading your clip.",
        variant: "destructive",
      });
    }
  };

  // Add a function to handle preview
  const handlePreview = (clip: any) => {
    setPreviewClip(clip);
    setPreviewOpen(true);
  };

  // Handle YouTube download completion
  const handleYouTubeDownloadComplete = (videoId: string, taskId: string) => {
    console.log(`YouTube download complete for video ${videoId} with task ${taskId}`);
    
    // Fetch the video details and any clips that were created
    axios.get(`${API_BASE_URL}/status/${taskId}`)
      .then(response => {
        if (response.data) {
          const status = response.data.status;
          const videoInfo = response.data.video_info || {};
          const clips = response.data.clips || [];
          const processTaskId = response.data.process_task_id;
          const progress = response.data.progress || 0;
          
          console.log(`YouTube status for task ${taskId}:`, {
            status,
            processTaskId,
            videoInfo,
            clips: clips.length,
            progress,
            fullResponse: response.data
          });
          
          // Add the video to the uploads list
          const newUpload: UploadItem = {
            id: videoId,
            filename: videoInfo.title || "YouTube Video",
            status: status === "completed" ? "processed" : 
                   (status === "processing_started" || status === "processing" || 
                    status === "transcribing" || status === "analyzing" || status === "queued") ? "processing" : 
                   "downloaded",
            taskId: processTaskId || taskId,
            uploadDate: new Date().toISOString(),
          };
          
          // Check if this upload already exists
          const existingUploadIndex = uploads.findIndex(u => u.id === videoId);
          
          if (existingUploadIndex >= 0) {
            // Update existing upload
            console.log(`Updating existing upload at index ${existingUploadIndex}:`, newUpload);
            setUploads(prev => {
              const updatedUploads = [...prev];
              updatedUploads[existingUploadIndex] = newUpload;
              return updatedUploads;
            });
          } else {
            // Add new upload
            console.log(`Adding new upload:`, newUpload);
            setUploads(prev => [newUpload, ...prev]);
          }
          
          // If processing is complete and there are clips, add them to the clips list
          if (status === "completed" && clips.length > 0) {
            console.log(`Adding ${clips.length} clips for video ${videoId}`);
            const newClips = clips.map(clip => ({
              id: clip.id,
              videoId: videoId,
              title: clip.title || "Clip",
              description: clip.description || "",
              startTime: clip.start_time,
              endTime: clip.end_time,
              duration: clip.end_time - clip.start_time,
              url: clip.url,
              thumbnailUrl: clip.thumbnail_url || "",
              createdAt: new Date().toISOString()
            }));
            
            setGeneratedClips(prev => [...newClips, ...prev]);
          }
          
          // For YouTube downloads, if status is "downloaded" and auto-processing is expected,
          // we should immediately show the processing UI and start polling
          if (status === "downloaded") {
            console.log(`Download complete for video ${videoId}, showing processing UI and starting polling`);
            
            // Update processing status display
            setProcessingProgress(0);
            setProcessingStatus("processing_started");
            setProcessingMessage("Starting processing...");
            setIsProcessing(true);
            setBackgroundProcessing(true);
            setProcessingVideo(videoId);
            
            // Show the full screen loading overlay
            setShowFullScreenLoading(true);
            
            // Start polling with the current task ID
            const taskToUse = processTaskId || taskId;
            console.log(`Starting polling with task ID: ${taskToUse}`);
            pollTaskStatus(taskToUse);
            
            // Also update the upload status to "processing" to be consistent with UI
            setUploads(prev => {
              const updatedUploads = [...prev];
              const index = updatedUploads.findIndex(u => u.id === videoId);
              if (index >= 0) {
                updatedUploads[index] = {
                  ...updatedUploads[index],
                  status: "processing"
                };
              }
              return updatedUploads;
            });
            
            return; // Exit early since we've handled the UI update
          }
          
          // If processing has started or is in progress, begin polling for status updates
          if ((status === "processing_started" || status === "queued" || 
               status === "processing" || status === "transcribing" || 
               status === "analyzing") && (processTaskId || taskId)) {
            const taskToUse = processTaskId || taskId;
            console.log(`Processing started/in progress for video ${videoId}, polling for updates with task ID: ${taskToUse}`);
            
            // Update processing status display
            setProcessingProgress(progress);
            setProcessingStatus(status);
            setProcessingMessage(response.data.message || null);
            setIsProcessing(true);
            setBackgroundProcessing(true);
            
            // Start or continue polling
            pollTaskStatus(taskToUse);
            setProcessingVideo(videoId);
            
            // Show the full screen loading overlay if not already shown
            setShowFullScreenLoading(true);
          }
          
          // Select the video
          setTaskId(videoId);
          
          // Show a success message
          toast({
            title: "YouTube Video Ready",
            description: status === "completed" 
              ? `Video "${videoInfo.title}" has been processed with ${clips.length} clips` 
              : `Video "${videoInfo.title}" has been downloaded`,
            variant: "default"
          });
        }
      })
      .catch(error => {
        console.error(`Error fetching YouTube download details for task ${taskId}:`, error);
        toast({
          title: "Error",
          description: "Failed to get video details",
          variant: "destructive"
        });
      });
  };

  // Add handler for starting YouTube processing
  const handleStartYouTubeProcessing = (videoId: string, taskId: string) => {
    console.log("Starting YouTube processing:", videoId, taskId);
    
    // Start polling for processing status
    pollTaskStatus(taskId);
    setProcessingVideo(videoId);
  };

  const uploadSection = (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Upload Podcast</h2>
      </div>
      
      {/* Upload Method Tabs */}
      <Tabs defaultValue={uploadMethod} onValueChange={(value) => setUploadMethod(value as 's3' | 'youtube')}>
        <TabsList className="mb-4">
          <TabsTrigger value="s3">
            <Upload className="w-4 h-4 mr-2" />
            Upload File
          </TabsTrigger>
          <TabsTrigger value="youtube">
            <Youtube className="w-4 h-4 mr-2" />
            YouTube URL
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="s3">
          <S3FileUploader 
            onUploadComplete={(videoId, s3Key, filename) => {
              // Add the uploaded file to the uploads list
              setUploads(prev => [
                {
                  id: videoId,
                  filename,
                  uploadDate: new Date().toISOString(),
                  status: 'uploaded',
                  s3Key
                },
                ...prev
              ]);
              
              // Show success notification
              showNotification({
                title: "Upload Complete",
                message: `${filename} has been uploaded successfully to S3`,
                type: "success"
              });
            }}
            onStartProcessing={(videoId, s3Key) => {
              // Call the startProcessing function to initiate processing
              startProcessing(videoId, s3Key);
            }}
            apiBaseUrl={API_BASE_URL}
          />
        </TabsContent>
        
        <TabsContent value="youtube">
          <YouTubeDownloader
            onDownloadComplete={handleYouTubeDownloadComplete}
            onStartProcessing={handleStartYouTubeProcessing}
            apiBaseUrl={API_BASE_URL}
          />
        </TabsContent>
      </Tabs>
      
      <div className="text-sm text-gray-500">
        <p>
          <InfoIcon className="inline h-4 w-4 mr-1" />
          {uploadMethod === 's3' 
            ? "Simply click the upload area or drag-and-drop a file to upload (up to 5GB). Processing starts automatically after upload."
            : "Enter a YouTube URL to download and process the video directly. No need to download locally first."
          }
        </p>
      </div>
      
      {/* Upload List and Status */}
      {uploads.length > 0 && (
        <div className="mt-6 border rounded-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {uploads.map((upload) => (
                <tr key={upload.id}>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{upload.filename}</div>
                    <div className="text-xs text-gray-500">{upload.id}</div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(upload.uploadDate).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      upload.status === 'uploaded' ? 'bg-green-100 text-green-800' :
                      upload.status === 'downloaded' ? 'bg-green-100 text-green-800' :
                      upload.status === 'downloading' ? 'bg-blue-100 text-blue-800' :
                      upload.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                      upload.status === 'completed' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {upload.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">
                    {(upload.status === 'uploaded' || upload.status === 'downloaded') && (
                      <Button 
                        size="sm" 
                        onClick={() => upload.s3Key 
                          ? startProcessing(upload.id, upload.s3Key)
                          : handleStartYouTubeProcessing(upload.id, upload.taskId || '')
                        } 
                        disabled={processingVideo === upload.id}
                      >
                        {processingVideo === upload.id ? 'Starting...' : 'Process'}
                      </Button>
                    )}
                    {upload.status === 'processing' && (
                      <div className="text-xs text-blue-600">
                        {upload.taskId && `Task ID: ${upload.taskId}`}
                      </div>
                    )}
                    {upload.status === 'completed' && (
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => {
                          // Navigate to generated clips
                          const clipsSectionEl = document.getElementById('clips-section');
                          if (clipsSectionEl) clipsSectionEl.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        View Clips
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {!isConnectedToBackend && statusPollingErrors >= MAX_CONSECUTIVE_ERRORS && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded fixed top-20 right-4 z-50 shadow-md">
          <div className="flex">
            <div className="py-1">
              <svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold">Backend Connection Issue</p>
              <p className="text-sm">Having trouble connecting to the server. Your task is still processing in the background. We'll keep trying to connect.</p>
              <button 
                className="mt-2 text-sm underline"
                onClick={() => {
                  setStatusPollingErrors(0);
                  setIsConnectedToBackend(true);
                  if (taskId) {
                    pollTaskStatus(taskId);
                  }
                }}
              >
                Retry now
              </button>
            </div>
          </div>
        </div>
      )}
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-brand-purple">Creator Dashboard</h1>
        <p className="text-muted-foreground mb-8">Upload your podcast and create viral social media clips</p>
        
        {/* Background Processing Indicator */}
        {backgroundProcessing && !showFullScreenLoading && (
          <div className="mb-6 bg-brand-purple/10 border border-brand-purple/20 rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-3 h-8 w-8 rounded-full bg-brand-purple/20 flex items-center justify-center">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-purple border-t-transparent"></div>
                </div>
                <div>
                  <h3 className="font-medium text-brand-purple">Processing in Background</h3>
                  <p className="text-sm text-muted-foreground">{processingMessage || "Creating clips from your podcast..."}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="font-medium">{Math.round(processingProgress)}%</span>
                  <span className="text-muted-foreground ml-1">complete</span>
                </div>
                <Button 
                  size="sm"
                  onClick={() => setShowFullScreenLoading(true)}
                >
                  Show Details
                </Button>
              </div>
            </div>
            <div className="mt-2">
              <Progress value={processingProgress} className="h-2" />
            </div>
          </div>
        )}
        
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 gap-6">
          <Card className="border-brand-purple/20 shadow-md hover:shadow-lg transition-all">
            <CardHeader className="bg-gradient-to-r from-brand-purple/10 to-transparent rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-brand-purple" />
                Upload Podcast
              </CardTitle>
              <CardDescription>
                Upload your podcast audio or video file to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              {uploadSection}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-brand-purple hover:bg-brand-purple/90 transition-all"
                disabled={isProcessing}
                onClick={() => {
                  if (uploadMethod === 's3') {
                    // Find and trigger the S3FileUploader's file input
                    const fileInput = document.querySelector<HTMLElement>('.S3FileUploader input[type="file"]');
                    if (fileInput) fileInput.click();
                  } else {
                    // Focus the YouTube URL input
                    const urlInput = document.getElementById('youtube-url');
                    if (urlInput) urlInput.focus();
                  }
                }}
              >
                <div className="flex items-center">
                  {uploadMethod === 's3' ? (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Select Podcast File
                    </>
                  ) : (
                    <>
                      <Youtube className="mr-2 h-4 w-4" />
                      Enter YouTube URL
                    </>
                  )}
                </div>
              </Button>
            </CardFooter>
          </Card>
          
          {/* Create Clips card removed */}
        </div>
        
        {/* Generated Clips Section */}
        {generatedClips.length > 0 && (
          <div className="mt-12" id="clips-section">
            <Card className="border-brand-purple/20 shadow-md overflow-visible">
              <CardHeader className="bg-gradient-to-r from-brand-purple/10 to-transparent">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Video className="h-5 w-5 text-brand-purple" />
                      Generated Clips
                    </CardTitle>
                    <CardDescription>
                      AI-generated clips from your podcast
                    </CardDescription>
                  </div>
                  <Tabs defaultValue="all" className="w-full sm:w-auto">
                    <TabsList className="grid grid-cols-3 w-full sm:w-auto">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="published">Published</TabsTrigger>
                      <TabsTrigger value="drafts">Drafts</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 my-4">
                    {generatedClips.map((clip) => (
                      <div key={clip.id} className="group relative">
                        <div className="aspect-video rounded-lg overflow-hidden relative">
                          <img 
                            src={clip.thumbnail.startsWith('http') ? clip.thumbnail : `${API_BASE_URL}${clip.thumbnail}`} 
                            alt={clip.title} 
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80"></div>
                          <div className="absolute bottom-3 left-3 right-3">
                            <h3 className="text-white text-sm font-medium line-clamp-2">{clip.title}</h3>
                            <div className="flex items-center text-white/70 text-xs mt-1">
                              <Clock className="h-3 w-3 mr-1" />
                              {clip.duration}
                              <span className="mx-2">•</span>
                              <Calendar className="h-3 w-3 mr-1" />
                              {clip.date}
                            </div>
                          </div>
                          <div className="absolute top-2 right-2 flex gap-1">
                            {clip.template !== "None" && (
                              <span className="bg-brand-purple text-white text-xs px-2 py-0.5 rounded-full">
                                {clip.template}
                              </span>
                            )}
                          </div>
                          <button className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-brand-purple/90 rounded-full p-2.5">
                              <Play className="h-8 w-8 text-white" />
                            </div>
                          </button>
                        </div>
                        
                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 text-xs gap-1 hover:bg-brand-purple hover:text-white hover:border-brand-purple"
                              onClick={() => handlePreview(clip)}
                            >
                              <PlayCircle className="h-3.5 w-3.5" />
                              Preview
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 text-xs gap-1 hover:bg-brand-purple hover:text-white hover:border-brand-purple"
                              onClick={() => downloadClip(clip.url)}
                            >
                              <Download className="h-3.5 w-3.5" />
                              Download
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="outline" className="h-8 w-8">
                                  <MoreHorizontal className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => navigate('/templates')}>
                                  <Rocket className="mr-2 h-4 w-4" />
                                  Add Game Template
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Share2 className="mr-2 h-4 w-4" />
                                  Share Clip
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                        
                        {/* Quick template selection */}
                        <div className="mt-3 p-2 bg-slate-50 rounded-md border border-slate-200">
                          <p className="text-xs text-muted-foreground mb-2">Add template:</p>
                          <div className="flex gap-1.5 overflow-x-auto pb-1">
                            {templateTypes.slice(0, 3).map((template, idx) => (
                              <Button 
                                key={idx}
                                size="sm" 
                                variant="outline" 
                                className="h-7 text-xs whitespace-nowrap hover:bg-brand-purple hover:text-white hover:border-brand-purple"
                                onClick={() => applyTemplateToClip(clip.id, template.name)}
                              >
                                <span className="mr-1">{template.icon.split(' ')[0]}</span>
                                {template.name}
                              </Button>
                            ))}
                            <Button 
                              size="sm"
                              variant="ghost"
                              className="h-7 px-2 text-xs"
                              onClick={() => navigate('/templates')}
                            >
                              <ChevronRight className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-center mt-4">
                  <Button 
                    onClick={() => navigate('/templates')} 
                    className="bg-brand-purple hover:bg-brand-purple/90"
                  >
                    Enhance Clips with Templates
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        
        <div className="mt-12" id="templates-section">
          <Card className="border-brand-purple/20 shadow-md">
            <CardHeader className="bg-gradient-to-r from-brand-purple/10 to-transparent rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5 text-brand-purple" />
                Game Templates
              </CardTitle>
              <CardDescription>
                Explore interactive game overlays for your podcast clips
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {templateTypes.slice(0, showTemplates ? templateTypes.length : 3).map((template, index) => (
                  <div 
                    key={index} 
                    className="border rounded-lg p-4 text-center hover:border-brand-purple hover:shadow-md transition-all group relative bg-white"
                  >
                    {template.new && (
                      <span className="absolute -top-2 -right-2 bg-brand-purple text-white text-xs px-2 py-1 rounded-full">
                        NEW
                      </span>
                    )}
                    {template.popular && !template.new && (
                      <span className="absolute -top-2 -right-2 bg-brand-blue text-white text-xs px-2 py-1 rounded-full">
                        POPULAR
                      </span>
                    )}
                    <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">{template.icon}</div>
                    <h3 className="font-medium mb-1 text-brand-purple">{template.name}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{template.description}</p>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full text-xs group-hover:bg-brand-purple group-hover:text-white"
                      onClick={() => navigate('/templates')}
                    >
                      Preview
                    </Button>
                  </div>
                ))}
              </div>
              
              {showTemplates && (
                <div className="bg-gradient-to-r from-brand-purple/5 to-brand-blue/5 rounded-lg p-4 border border-brand-purple/10">
                  <h3 className="font-medium text-lg mb-2">Template Suggestions</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Based on your podcast content, we recommend these game templates for maximum engagement:
                  </p>
                  <div className="space-y-3">
                    {[
                      {name: "Emoji Reaction", match: "98%", reason: "High emotional content"},
                      {name: "Quiz Show", match: "85%", reason: "Educational segments detected"},
                      {name: "Poll", match: "75%", reason: "Debatable topics found"}
                    ].map((suggestion, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-white rounded border">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-8 bg-brand-purple rounded-full"></div>
                          <div>
                            <p className="font-medium">{suggestion.name}</p>
                            <p className="text-xs text-muted-foreground">{suggestion.reason}</p>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-brand-purple">{suggestion.match}</span>
                          <span className="text-xs text-muted-foreground"> match</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/docs')}>
                <Link className="mr-2 h-4 w-4" />
                Template Documentation
              </Button>
              <Button className="bg-brand-purple hover:bg-brand-purple/90" onClick={exploreMoreTemplates}>
                <Rocket className="mr-2 h-4 w-4" />
                {showTemplates ? "Customize Templates" : "Explore More Templates"}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {showTemplates && (
          <div className="mt-8 bg-brand-purple text-white p-6 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div>
                <h2 className="text-xl font-bold mb-2">Ready to amplify your podcast reach?</h2>
                <p className="text-white/80 mb-4 md:mb-0">
                  Your clips are ready! Add game overlays and share them on social media.
                </p>
              </div>
              <Button 
                className="bg-white text-brand-purple hover:bg-white/90"
                onClick={() => toast({
                  title: "Publish Clips",
                  description: "Your clips would be published to social media.",
                })}
              >
                Publish My Clips
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
      <Footer />
      {/* Full-screen loading overlay */}
      {showFullScreenLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex flex-col items-center justify-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 mb-4 relative">
                <div className="absolute inset-0 border-4 border-t-brand-purple border-opacity-20 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-brand-purple text-lg font-bold">{Math.round(processingProgress)}%</span>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold mb-2">Processing Your Podcast</h3>
              <p className="text-gray-600 mb-4 text-center">
                {processingMessage || "We're creating engaging clips from your podcast. This may take a few minutes."}
              </p>
              
              <div className="w-full mb-4">
                <Progress value={processingProgress} className="h-2" />
              </div>
              
              <div className="flex items-center justify-between w-full text-sm text-gray-500">
                <span>{processingStatus || "Processing"}</span>
                <span>{Math.round(processingProgress)}% Complete</span>
              </div>
              
              <Button 
                variant="outline" 
                className="mt-6"
                onClick={() => {
                  // Hide the overlay but maintain processing state
                  setShowFullScreenLoading(false);
                  // Ensure background processing state is set
                  setBackgroundProcessing(true);
                  // Inform the user that processing continues
                  toast({
                    title: "Processing in Background",
                    description: "Your podcast is still being processed. You can check the status at the top of the dashboard.",
                  });
                }}
              >
                Continue in Background
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Preview Modal */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle>{previewClip?.title || "Clip Preview"}</DialogTitle>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setPreviewOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <DialogDescription>
              {previewClip?.duration ? `Duration: ${previewClip.duration}` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <div className="aspect-[9/16] h-auto max-h-[60vh] overflow-hidden rounded-md bg-black">
              {previewClip && (
                <video 
                  src={previewClip.url.startsWith('http') ? previewClip.url : `${API_BASE_URL}${previewClip.url}`}
                  controls
                  autoPlay
                  className="w-full h-full object-cover"
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                // Copy share link to clipboard
                const shareUrl = `${window.location.origin}/share/${previewClip?.id}`;
                navigator.clipboard.writeText(shareUrl);
                toast({
                  title: "Link copied",
                  description: "Share link copied to clipboard",
                });
              }}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button 
              variant="default"
              size="sm"
              onClick={() => downloadClip(previewClip.url)}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;

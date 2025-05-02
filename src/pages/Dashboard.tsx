
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Upload, Play, Rocket } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Dashboard = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleUpload(e.target.files[0]);
    }
  };

  const handleUpload = (file: File) => {
    setUploadedFile(file);
    setIsUploading(true);
    
    // Simulate file upload
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Upload successful!",
        description: `${file.name} has been uploaded.`,
      });
    }, 2000);
  };

  const startProcessing = () => {
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Processing complete!",
        description: "Your clips are ready for review.",
      });
    }, 3000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Upload Podcast</CardTitle>
              <CardDescription>
                Upload your podcast audio or video file to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center ${dragActive ? 'border-brand-purple bg-purple-100/10' : 'border-gray-300'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center justify-center py-4">
                  <Upload className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    MP3, MP4, WAV (max. 5GB)
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                    accept=".mp3,.mp4,.wav"
                  />
                </div>
              </div>
              
              {uploadedFile && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium truncate">{uploadedFile.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <label htmlFor="file-upload" className="w-full">
                <Button 
                  className="w-full btn-gradient"
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Uploading...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Podcast
                    </div>
                  )}
                </Button>
              </label>
            </CardFooter>
          </Card>
          
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Create Clips</CardTitle>
              <CardDescription>
                Process your podcast to create social media ready clips
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[240px] flex items-center justify-center">
              {uploadedFile ? (
                <div className="text-center">
                  <div className="mb-4">
                    <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                      <Play className="h-8 w-8 text-brand-purple" />
                    </div>
                  </div>
                  <h3 className="mb-2 font-medium">Ready to process</h3>
                  <p className="text-sm text-muted-foreground">
                    Your file is ready to be processed into clips
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Upload a podcast to get started
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                disabled={!uploadedFile || isProcessing}
                onClick={startProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Play className="mr-2 h-4 w-4" />
                    Start Creating Clips
                  </div>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Game Templates</CardTitle>
              <CardDescription>
                Explore interactive game overlays for your podcast clips
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { 
                    title: "Emoji Reaction", 
                    description: "Add emoji reactions that viewers can tap",
                    image: "🎮 😂 ❤️ 🔥"
                  },
                  {
                    title: "Quiz Show", 
                    description: "Create interactive quizzes based on your content",
                    image: "❓ 🎯 🏆"
                  },
                  {
                    title: "Word Cloud", 
                    description: "Generate clickable keyword clouds",
                    image: "☁️ 📝 🔤"
                  }
                ].map((template, index) => (
                  <div key={index} className="border rounded-lg p-4 text-center hover:border-brand-purple hover:shadow-md transition-all">
                    <div className="text-3xl mb-2">{template.image}</div>
                    <h3 className="font-medium mb-1">{template.title}</h3>
                    <p className="text-xs text-muted-foreground">{template.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <Rocket className="mr-2 h-4 w-4" />
                Explore More Templates
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;

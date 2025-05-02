
import React, { useState, useRef } from "react";
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
  Download
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

const Dashboard = () => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [generatedClips, setGeneratedClips] = useState<any[]>([]);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const startProcessing = () => {
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      
      // Generate mock clips
      const mockClips = [
        {
          id: 1,
          title: "Key insight on digital marketing trends",
          duration: "1:45",
          date: "Just now",
          thumbnail: "https://via.placeholder.com/300x168/6D28D9/FFFFFF?text=Clip+1",
          views: 0,
          engagement: "0%",
          template: "None"
        },
        {
          id: 2,
          title: "Funny moment about startup culture",
          duration: "0:58",
          date: "Just now",
          thumbnail: "https://via.placeholder.com/300x168/4F46E5/FFFFFF?text=Clip+2",
          views: 0,
          engagement: "0%",
          template: "None"
        },
        {
          id: 3,
          title: "Controversial opinion on industry standards",
          duration: "2:12",
          date: "Just now",
          thumbnail: "https://via.placeholder.com/300x168/9333EA/FFFFFF?text=Clip+3",
          views: 0,
          engagement: "0%",
          template: "None"
        },
        {
          id: 4,
          title: "Advice for new entrepreneurs",
          duration: "1:24",
          date: "Just now",
          thumbnail: "https://via.placeholder.com/300x168/8B5CF6/FFFFFF?text=Clip+4",
          views: 0,
          engagement: "0%",
          template: "None"
        },
        {
          id: 5,
          title: "Predictions for next year's tech innovations",
          duration: "1:37",
          date: "Just now",
          thumbnail: "https://via.placeholder.com/300x168/7C3AED/FFFFFF?text=Clip+5",
          views: 0,
          engagement: "0%",
          template: "None"
        }
      ];
      
      setGeneratedClips(mockClips);
      
      toast({
        title: "Processing complete!",
        description: "Your clips are ready for review.",
      });
      
      // Show clip creation success
      toast({
        title: "New clips created!",
        description: "5 clips have been generated from your podcast.",
      });
      
      // Show templates section for enhancing clips
      setShowTemplates(true);
      
      // Auto-scroll to clips section
      setTimeout(() => {
        const clipsSection = document.getElementById('clips-section');
        if (clipsSection) {
          clipsSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }, 3000);
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

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2 text-brand-purple">Creator Dashboard</h1>
        <p className="text-muted-foreground mb-8">Upload your podcast and create viral social media clips</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="h-full border-brand-purple/20 shadow-md hover:shadow-lg transition-all">
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
              <div 
                className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all ${dragActive ? 'border-brand-purple bg-brand-purple/5' : 'border-gray-300 hover:border-brand-purple/50'}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={triggerFileInput}
              >
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="h-16 w-16 rounded-full bg-brand-purple/10 flex items-center justify-center mb-4">
                    <FileUp className="h-8 w-8 text-brand-purple" />
                  </div>
                  <p className="mb-2 text-sm font-medium">
                    <span className="text-brand-purple font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    MP3, MP4, WAV (max. 5GB)
                  </p>
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    type="file"
                    className="hidden"
                    onChange={handleChange}
                    accept=".mp3,.mp4,.wav"
                  />
                </div>
              </div>
              
              {uploadedFile && (
                <div className="mt-4 p-4 bg-brand-purple/5 rounded-md border border-brand-purple/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {uploadedFile.type.includes('audio') ? (
                        <Headphones className="h-8 w-8 text-brand-purple" />
                      ) : (
                        <Video className="h-8 w-8 text-brand-purple" />
                      )}
                      <div>
                        <p className="text-sm font-medium truncate max-w-[200px]">{uploadedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      Ready
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-brand-purple hover:bg-brand-purple/90 transition-all"
                disabled={isUploading}
                onClick={triggerFileInput}
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
            </CardFooter>
          </Card>
          
          <Card className="h-full border-brand-purple/20 shadow-md hover:shadow-lg transition-all">
            <CardHeader className="bg-gradient-to-r from-brand-purple/10 to-transparent rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Scissors className="h-5 w-5 text-brand-purple" />
                Create Clips
              </CardTitle>
              <CardDescription>
                Process your podcast to create social media ready clips
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[240px] flex items-center justify-center">
              {uploadedFile ? (
                <div className="text-center">
                  <div className="mb-6">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-brand-purple/10">
                      <Play className="h-10 w-10 text-brand-purple" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-medium">Ready to Process</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto mb-4">
                    Your file is ready to be processed. Our AI will identify the best moments and create engaging clips.
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mb-6">
                    <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                      <Mic className="h-10 w-10 text-muted-foreground" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-muted-foreground">No File Uploaded</h3>
                  <p className="text-sm text-muted-foreground">
                    Upload a podcast to get started with clip creation
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full"
                variant={uploadedFile ? "default" : "outline"}
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
                    <Sparkles className="mr-2 h-4 w-4" />
                    Start Creating Clips
                  </div>
                )}
              </Button>
            </CardFooter>
          </Card>
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
                            src={clip.thumbnail} 
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
                            >
                              <PlayCircle className="h-3.5 w-3.5" />
                              Preview
                            </Button>
                            
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 text-xs gap-1 hover:bg-brand-purple hover:text-white hover:border-brand-purple"
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
    </div>
  );
};

export default Dashboard;

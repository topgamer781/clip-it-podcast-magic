
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Play, ArrowRight, Upload, Rocket } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Demo = () => {
  const [activeTab, setActiveTab] = useState("preview");
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">See ClipIt in Action</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch how our AI transforms podcast content into engaging social media clips
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Tabs defaultValue="preview" onValueChange={setActiveTab} className="mb-12">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="preview">Live Preview</TabsTrigger>
              <TabsTrigger value="process">Process Flow</TabsTrigger>
              <TabsTrigger value="customize">Customization</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-4">See the transformation</h2>
                  <p className="mb-4 text-muted-foreground">
                    Watch how our AI transforms a standard podcast episode into an engaging, 
                    shareable clip with captions and interactive elements.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center font-medium mr-3">1</div>
                      <span>Original podcast audio is analyzed</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center font-medium mr-3">2</div>
                      <span>Key moments are identified</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center font-medium mr-3">3</div>
                      <span>Clip is enhanced with captions and games</span>
                    </div>
                  </div>
                  <Button className="mt-6 btn-gradient" onClick={() => setIsPlaying(!isPlaying)}>
                    <Play className="mr-2 h-4 w-4" />
                    {isPlaying ? "Pause Demo" : "Play Demo"}
                  </Button>
                </div>
                <div>
                  <div className="rounded-2xl overflow-hidden border shadow-lg bg-black aspect-[9/16]">
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {!isPlaying && (
                          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 cursor-pointer">
                            <Play className="h-10 w-10 text-white" />
                          </div>
                        )}
                        {isPlaying && (
                          <div className="absolute inset-0 flex flex-col">
                            {/* Video content would be here */}
                            <div className="flex-grow relative">
                              <div className="absolute bottom-24 left-4 right-4 text-center">
                                <div className="bg-black/40 text-white p-2 rounded text-sm">
                                  "Our AI technology extracts the most engaging moments from your podcast!"
                                </div>
                              </div>
                            </div>
                            
                            {/* Game element */}
                            <div className="h-20 bg-black/40 backdrop-blur-md flex items-center justify-center p-2">
                              <div className="w-full h-full rounded-full bg-white/10 backdrop-blur flex items-center justify-evenly">
                                {["😂", "❤️", "🔥", "👍"].map((emoji, index) => (
                                  <div key={index} className={`text-2xl ${index === 2 ? "animate-bounce-slow" : ""}`}>
                                    {emoji}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="process" className="animate-fade-in">
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl font-bold mb-4">How It Works</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                    Our AI-powered process transforms long-form podcast content into short, engaging clips.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-brand-purple/10 rounded-full inline-flex items-center justify-center mb-4">
                          <Upload className="h-6 w-6 text-brand-purple" />
                        </div>
                        <h3 className="text-lg font-medium">1. Upload</h3>
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        Upload your podcast audio or video file directly to our platform.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-brand-purple/10 rounded-full inline-flex items-center justify-center mb-4">
                          <div className="h-6 w-6 text-brand-purple">🧠</div>
                        </div>
                        <h3 className="text-lg font-medium">2. Process</h3>
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        Our AI analyzes your content to find the most engaging segments.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center mb-4">
                        <div className="w-12 h-12 bg-brand-purple/10 rounded-full inline-flex items-center justify-center mb-4">
                          <div className="h-6 w-6 text-brand-purple">🚀</div>
                        </div>
                        <h3 className="text-lg font-medium">3. Create</h3>
                      </div>
                      <p className="text-sm text-muted-foreground text-center">
                        Get ready-to-share clips with captions and interactive elements.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="customize" className="animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Customize Your Clips</h2>
                  <p className="mb-6 text-muted-foreground">
                    Personalize your content with our intuitive customization options.
                  </p>
                  
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="caption-style">Caption Style</Label>
                      <select 
                        id="caption-style" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      >
                        <option value="modern">Modern</option>
                        <option value="classic">Classic</option>
                        <option value="bold">Bold</option>
                        <option value="minimal">Minimal</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="game-template">Game Template</Label>
                      <select 
                        id="game-template" 
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                      >
                        <option value="emoji">Emoji Reactions</option>
                        <option value="quiz">Quiz Game</option>
                        <option value="word">Word Cloud</option>
                        <option value="poll">Live Poll</option>
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="branding">Branding Color</Label>
                      <div className="flex gap-2">
                        <Input type="color" id="branding" defaultValue="#8270dd" className="w-12 h-10 p-1" />
                        <Input type="text" defaultValue="#8270dd" className="flex-1" />
                      </div>
                    </div>
                    
                    <Button className="w-full">
                      Apply Customizations
                    </Button>
                  </form>
                </div>
                
                <div className="bg-muted p-6 rounded-lg">
                  <div className="aspect-[9/16] bg-black rounded-md overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-white text-center p-4">
                        <p className="text-sm">Customization preview</p>
                        <div className="mt-4">
                          <Eye className="h-8 w-8 mx-auto" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
          
          <div className="text-center mt-12 pt-6 border-t">
            <h2 className="text-2xl font-bold mb-4">Ready to try it yourself?</h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-gradient">
                <Rocket className="mr-2 h-4 w-4" />
                Get Started Free
              </Button>
              <Button variant="outline">
                Learn More <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Demo;

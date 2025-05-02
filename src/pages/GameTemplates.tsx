
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Rocket, 
  Sparkles, 
  Play, 
  Star, 
  Heart, 
  MessageSquare, 
  ThumbsUp,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";

const GameTemplates = () => {
  const [activeTab, setActiveTab] = useState("popular");
  const { toast } = useToast();
  const [previewTemplate, setPreviewTemplate] = useState(null);
  
  const handlePreview = (template) => {
    setPreviewTemplate(template);
  };
  
  const handleUseTemplate = (templateName) => {
    toast({
      title: "Template Selected",
      description: `${templateName} template has been applied to your clip.`
    });
  };

  const templates = {
    popular: [
      {
        id: "emoji-reaction",
        name: "Emoji Reaction",
        description: "Add emoji reactions that viewers can tap",
        icon: "🎮 😂 ❤️ 🔥",
        category: "Engagement",
        popular: true
      },
      {
        id: "poll",
        name: "Poll",
        description: "Let viewers vote on questions or options",
        icon: "🗳️ 📊 👍",
        category: "Interactive",
        popular: true,
        new: true
      },
      {
        id: "quotes",
        name: "Quotes",
        description: "Highlight quotable moments with animations",
        icon: "💬 ✨ 📜",
        category: "Visual",
        popular: true
      },
      {
        id: "question-answer",
        name: "Q&A",
        description: "Interactive question and answer format",
        icon: "❓ 💭 ✅",
        category: "Interactive",
        popular: true
      }
    ],
    interactive: [
      {
        id: "quiz-show",
        name: "Quiz Show",
        description: "Create interactive quizzes based on your content",
        icon: "❓ 🎯 🏆",
        category: "Interactive",
        popular: false
      },
      {
        id: "poll",
        name: "Poll",
        description: "Let viewers vote on questions or options",
        icon: "🗳️ 📊 👍",
        category: "Interactive",
        popular: true,
        new: true
      },
      {
        id: "tap-rhythm",
        name: "Tap Rhythm",
        description: "Music-synced tapping game",
        icon: "🎵 👆 🎶",
        category: "Interactive",
        popular: false,
        new: true
      },
      {
        id: "swipe-choice",
        name: "Swipe Choice",
        description: "Swipe left/right to make choices",
        icon: "👈 🔀 👉",
        category: "Interactive",
        popular: false
      },
      {
        id: "question-answer",
        name: "Q&A",
        description: "Interactive question and answer format",
        icon: "❓ 💭 ✅",
        category: "Interactive",
        popular: true
      }
    ],
    visual: [
      {
        id: "emoji-reaction",
        name: "Emoji Reaction",
        description: "Add emoji reactions that viewers can tap",
        icon: "🎮 😂 ❤️ 🔥",
        category: "Visual",
        popular: true
      },
      {
        id: "word-cloud",
        name: "Word Cloud",
        description: "Generate clickable keyword clouds",
        icon: "☁️ 📝 🔤",
        category: "Visual",
        popular: false
      },
      {
        id: "quotes",
        name: "Quotes",
        description: "Highlight quotable moments with animations",
        icon: "💬 ✨ 📜",
        category: "Visual",
        popular: true
      },
      {
        id: "animated-captions",
        name: "Animated Captions",
        description: "Text animations that follow speech patterns",
        icon: "🔤 ✨ 🎬",
        category: "Visual",
        popular: false,
        new: true
      },
      {
        id: "visual-effects",
        name: "Visual Effects",
        description: "Add visual effects based on audio cues",
        icon: "🌟 🎨 💫",
        category: "Visual",
        popular: false
      }
    ],
    engagement: [
      {
        id: "emoji-reaction",
        name: "Emoji Reaction",
        description: "Add emoji reactions that viewers can tap",
        icon: "🎮 😂 ❤️ 🔥",
        category: "Engagement",
        popular: true
      },
      {
        id: "comments",
        name: "Comments",
        description: "Simulated comment section with reactions",
        icon: "💬 👥 📝",
        category: "Engagement",
        popular: false
      },
      {
        id: "follow-button",
        name: "Follow Button",
        description: "Animated follow button with counter",
        icon: "➕ 👤 🔔",
        category: "Engagement",
        popular: false
      },
      {
        id: "share-prompt",
        name: "Share Prompt",
        description: "Animated prompts to share content",
        icon: "📤 🔄 📲",
        category: "Engagement",
        popular: false,
        new: true
      }
    ]
  };

  const getTemplates = () => {
    switch (activeTab) {
      case "popular":
        return templates.popular;
      case "interactive":
        return templates.interactive;
      case "visual":
        return templates.visual;
      case "engagement":
        return templates.engagement;
      default:
        return templates.popular;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-purple-50 to-white">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2 text-center">
            <span className="text-brand-purple">Game </span> 
            Templates Gallery
          </h1>
          <p className="text-muted-foreground mb-10 text-center max-w-2xl mx-auto">
            Explore our collection of interactive game templates to boost engagement with your podcast clips on social media
          </p>
          
          <Tabs defaultValue="popular" value={activeTab} onValueChange={setActiveTab} className="w-full mb-10">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="popular" className="data-[state=active]:bg-brand-purple data-[state=active]:text-white">
                <Star className="mr-2 h-4 w-4" />
                Popular
              </TabsTrigger>
              <TabsTrigger value="interactive" className="data-[state=active]:bg-brand-purple data-[state=active]:text-white">
                <ThumbsUp className="mr-2 h-4 w-4" />
                Interactive
              </TabsTrigger>
              <TabsTrigger value="visual" className="data-[state=active]:bg-brand-purple data-[state=active]:text-white">
                <Sparkles className="mr-2 h-4 w-4" />
                Visual
              </TabsTrigger>
              <TabsTrigger value="engagement" className="data-[state=active]:bg-brand-purple data-[state=active]:text-white">
                <MessageSquare className="mr-2 h-4 w-4" />
                Engagement
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {getTemplates().map((template, index) => (
              <Card key={index} className="border-brand-purple/20 hover:shadow-md transition-all overflow-hidden group">
                <CardHeader className="p-4 bg-gradient-to-r from-brand-purple/10 to-transparent">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    {template.new && (
                      <span className="bg-brand-purple text-white text-xs px-2 py-1 rounded-full">
                        NEW
                      </span>
                    )}
                  </div>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardContent className="p-6 flex justify-center items-center">
                  <div className="text-4xl group-hover:scale-110 transition-transform duration-300">{template.icon}</div>
                </CardContent>
                <div className="absolute inset-0 bg-brand-purple/80 flex items-center justify-center flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button 
                    className="bg-white text-brand-purple hover:bg-white/90"
                    onClick={() => handlePreview(template)}
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Preview Template
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-white text-white hover:bg-white/20"
                    onClick={() => handleUseTemplate(template.name)}
                  >
                    <Rocket className="mr-2 h-4 w-4" />
                    Use Template
                  </Button>
                </div>
                <CardFooter className="flex justify-between p-4 border-t">
                  <span className="text-xs text-muted-foreground">{template.category}</span>
                  {template.popular && (
                    <span className="flex items-center text-xs text-brand-purple">
                      <Star className="h-3 w-3 mr-1 fill-brand-purple" />
                      Popular
                    </span>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <Card className="border-brand-purple/20 bg-brand-purple/5 p-6 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-xl flex items-center justify-center gap-2">
                  <Heart className="h-5 w-5 text-brand-purple" />
                  Custom Templates
                </CardTitle>
                <CardDescription>
                  Need a custom interactive template for your specific podcast style?
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our team can design custom interactive elements that match your brand and content style perfectly. Reach out to discuss your requirements.
                </p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button 
                  className="bg-brand-purple hover:bg-brand-purple/90"
                  onClick={() => toast({
                    title: "Custom Template Request",
                    description: "Our team will contact you shortly."
                  })}
                >
                  Request Custom Template
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Template Preview Dialog */}
      <Dialog open={previewTemplate !== null} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-brand-purple">
                {previewTemplate?.name} 
              </span>
              <span className="text-xl ml-2">
                {previewTemplate?.icon?.split(' ')[0]}
              </span>
            </DialogTitle>
            <DialogDescription>
              {previewTemplate?.description}
            </DialogDescription>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          
          <div className="flex flex-col items-center">
            <div className="aspect-[9/16] w-full max-w-[250px] bg-black/90 rounded-xl overflow-hidden my-4">
              {previewTemplate?.id === "emoji-reaction" && (
                <div className="h-full w-full p-4 flex flex-col justify-end">
                  <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3 animate-fade-in">
                    <p className="text-white text-sm text-center mb-2">TAP YOUR REACTION</p>
                    <div className="flex justify-around">
                      {["😂", "❤️", "🔥", "👍", "🎉"].map((emoji, i) => (
                        <div key={i} className="text-2xl cursor-pointer hover:scale-125 transition-transform">
                          {emoji}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {previewTemplate?.id === "poll" && (
                <div className="h-full w-full p-4 flex flex-col justify-end">
                  <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3 animate-fade-in">
                    <p className="text-white text-sm text-center mb-2">WHICH OPTION DO YOU PREFER?</p>
                    <div className="space-y-2">
                      <div className="bg-white/10 hover:bg-white/20 rounded-md p-2 cursor-pointer transition-all">
                        <div className="text-white flex justify-between">
                          <span>Option A</span>
                          <span>67%</span>
                        </div>
                        <div className="h-1.5 bg-white/20 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-brand-purple rounded-full" style={{width: '67%'}}></div>
                        </div>
                      </div>
                      <div className="bg-white/10 hover:bg-white/20 rounded-md p-2 cursor-pointer transition-all">
                        <div className="text-white flex justify-between">
                          <span>Option B</span>
                          <span>33%</span>
                        </div>
                        <div className="h-1.5 bg-white/20 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-brand-purple rounded-full" style={{width: '33%'}}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {previewTemplate?.id === "quiz-show" && (
                <div className="h-full w-full p-4 flex flex-col justify-end">
                  <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3 animate-fade-in">
                    <p className="text-white text-sm text-center mb-2">QUIZ TIME!</p>
                    <p className="text-white text-xs mb-3 text-center">What's the correct answer?</p>
                    <div className="space-y-1.5">
                      <div className="bg-white/10 hover:bg-white/30 rounded-md p-1.5 cursor-pointer transition-all text-white text-xs">Answer A</div>
                      <div className="bg-white/10 hover:bg-white/30 rounded-md p-1.5 cursor-pointer transition-all text-white text-xs">Answer B</div>
                      <div className="bg-brand-purple/60 hover:bg-brand-purple rounded-md p-1.5 cursor-pointer transition-all text-white text-xs flex items-center justify-between">
                        <span>Answer C</span>
                        <span className="text-xs">✓</span>
                      </div>
                      <div className="bg-white/10 hover:bg-white/30 rounded-md p-1.5 cursor-pointer transition-all text-white text-xs">Answer D</div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Default preview for other templates */}
              {(!previewTemplate?.id || 
                (previewTemplate?.id !== "emoji-reaction" && 
                 previewTemplate?.id !== "poll" && 
                 previewTemplate?.id !== "quiz-show")) && (
                <div className="h-full w-full p-4 flex flex-col justify-center items-center">
                  <div className="animate-pulse-subtle text-6xl mb-4">
                    {previewTemplate?.icon?.split(' ').slice(0, 2).join(' ')}
                  </div>
                  <div className="bg-black/40 backdrop-blur-sm rounded-xl p-3 text-center">
                    <p className="text-white text-sm">{previewTemplate?.name}</p>
                    <p className="text-white/70 text-xs mt-1">{previewTemplate?.category}</p>
                  </div>
                </div>
              )}
            </div>
            
            <Button 
              className="mt-4 bg-brand-purple hover:bg-brand-purple/90"
              onClick={() => {
                handleUseTemplate(previewTemplate?.name);
                setPreviewTemplate(null);
              }}
            >
              <Rocket className="mr-2 h-4 w-4" />
              Use This Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default GameTemplates;

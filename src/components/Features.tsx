
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileVideo, Mic, Rss, Calendar, Upload, Video, Youtube } from "lucide-react";

const features = [
  {
    icon: <Upload className="h-8 w-8 text-brand-purple" />,
    title: "Easy Upload",
    description: "Upload your podcast videos directly or connect your RSS feed for automatic processing."
  },
  {
    icon: <Youtube className="h-8 w-8 text-brand-purple" />,
    title: "YouTube Integration",
    description: "Automatically pull your latest episodes from your YouTube channel for processing."
  },
  {
    icon: <Mic className="h-8 w-8 text-brand-purple" />,
    title: "AI Transcription",
    description: "High-accuracy speech-to-text conversion powered by advanced AI models."
  },
  {
    icon: <Video className="h-8 w-8 text-brand-purple" />,
    title: "Smart Clip Selection",
    description: "Our AI identifies the most engaging moments in your podcasts automatically."
  },
  {
    icon: <Calendar className="h-8 w-8 text-brand-purple" />,
    title: "Scheduled Processing",
    description: "Set up automatic processing for new episodes as they're released."
  },
  {
    icon: <FileVideo className="h-8 w-8 text-brand-purple" />,
    title: "Game Overlays",
    description: "Interactive game elements to boost engagement on social platforms."
  }
];

const Features = () => {
  return (
    <section className="py-20 px-4 bg-muted/50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful AI-Driven Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Turn hours of podcast content into engaging short-form clips with these powerful features
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="feature-card border border-border/50">
              <CardHeader className="pb-2">
                <div className="mb-3">{feature.icon}</div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;

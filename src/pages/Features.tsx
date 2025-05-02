
import React from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ArrowRight, FileVideo, Mic, Rss, Calendar, Upload, Video, Youtube } from "lucide-react";
import Footer from "@/components/Footer";

const features = [
  {
    icon: <Upload className="h-12 w-12 text-brand-purple" />,
    title: "Easy Upload",
    description: "Upload your podcast videos directly or connect your RSS feed for automatic processing."
  },
  {
    icon: <Youtube className="h-12 w-12 text-brand-purple" />,
    title: "YouTube Integration",
    description: "Automatically pull your latest episodes from your YouTube channel for processing."
  },
  {
    icon: <Mic className="h-12 w-12 text-brand-purple" />,
    title: "AI Transcription",
    description: "High-accuracy speech-to-text conversion powered by advanced AI models."
  },
  {
    icon: <Video className="h-12 w-12 text-brand-purple" />,
    title: "Smart Clip Selection",
    description: "Our AI identifies the most engaging moments in your podcasts automatically."
  },
  {
    icon: <Calendar className="h-12 w-12 text-brand-purple" />,
    title: "Scheduled Processing",
    description: "Set up automatic processing for new episodes as they're released."
  },
  {
    icon: <FileVideo className="h-12 w-12 text-brand-purple" />,
    title: "Game Overlays",
    description: "Interactive game elements to boost engagement on social platforms."
  },
  {
    icon: <Rss className="h-12 w-12 text-brand-purple" />,
    title: "RSS Integration",
    description: "Connect your podcast RSS feed for continuous clip generation from new episodes."
  }
];

const FeatureDetails = [
  {
    title: "Content Understanding",
    description: "Our AI analyzes your podcast content to identify the most engaging segments:",
    items: [
      "High-accuracy speech-to-text transcription",
      "Semantic parsing to find funny, emotionally charged, or insightful moments",
      "Smart detection of audience engagement cues like laughter and tonal shifts",
      "Prioritization of 1-minute or longer segments for optimal social sharing"
    ]
  },
  {
    title: "Clip Enhancement",
    description: "Turn raw podcast footage into social media gold with these enhancements:",
    items: [
      "Dynamic captions with perfect synchronization",
      "Stylish font options with emoji integration",
      "Face tracking to keep speakers centered in vertical format",
      "Color emphasis for key phrases and important moments"
    ]
  },
  {
    title: "Export & Publishing",
    description: "Get your clips ready for all major platforms:",
    items: [
      "Optimized export for TikTok, Instagram Reels, and YouTube Shorts",
      "Vertical (9:16) format conversion",
      "High-quality rendering with compression options",
      "Batch processing for multiple clips"
    ]
  }
];

const Features = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Powerful Features</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Our AI-powered platform transforms your lengthy podcasts into engaging short-form clips 
              perfect for social media.
            </p>
          </div>
        </section>

        {/* Main Features Grid */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Everything You Need</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className="p-8 rounded-xl border border-border/50 bg-card transition-all hover:shadow-md hover:-translate-y-1"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature Details */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">How Our Technology Works</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {FeatureDetails.map((section, index) => (
                <div key={index} className="p-8 rounded-xl bg-card border border-border/50">
                  <h3 className="text-2xl font-bold mb-4">{section.title}</h3>
                  <p className="text-muted-foreground mb-6">{section.description}</p>
                  <ul className="space-y-3">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start">
                        <div className="mr-3 mt-1 text-brand-purple">•</div>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Podcast Content?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join hundreds of podcasters who are extending their reach with AI-powered clips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-purple-gradient hover:bg-purple-600 h-12 px-8 text-lg">
                Get Started Free
              </Button>
              <Button variant="outline" className="border-brand-purple text-brand-purple hover:bg-brand-purple/10 h-12 px-8 text-lg">
                See Demo <ArrowRight className="ml-2" />
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Features;


import React from "react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    number: "01",
    title: "Upload or Connect Source",
    description: "Upload your podcast videos or connect your RSS feed or YouTube channel."
  },
  {
    number: "02",
    title: "AI Processing",
    description: "Our AI transcribes your content and identifies the most engaging segments."
  },
  {
    number: "03",
    title: "Review and Customize",
    description: "Preview AI-generated clips and customize captions, animations and game elements."
  },
  {
    number: "04",
    title: "Export and Share",
    description: "Export your clips in formats optimized for TikTok, Instagram Reels, and YouTube Shorts."
  }
];

const HowItWorks = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How ClipIt Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Turn your podcasts into social media gold in four simple steps
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-muted rounded-lg p-6 h-full">
                <div className="text-4xl font-bold text-brand-purple mb-4">{step.number}</div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <div className="w-8 h-8 rotate-45 border-t border-r border-border/50"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <Button className="btn-gradient h-12 px-8 text-lg">
            Start Creating Clips
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;

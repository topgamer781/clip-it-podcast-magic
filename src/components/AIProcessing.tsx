
import React from "react";
import { Card, CardContent } from "@/components/ui/card";

const AIProcessing = () => {
  return (
    <section className="py-20 px-4 bg-brand-dark text-white clip-path-slant">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powered by Advanced AI</h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Our sophisticated AI understands your content and identifies the most engaging moments
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute inset-0 bg-brand-purple/20 rounded-full filter blur-3xl"></div>
          
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-3">
                <div className="p-8 border-b lg:border-b-0 lg:border-r border-white/10">
                  <h3 className="text-xl font-semibold mb-3 text-brand-purple-light">Speech Recognition</h3>
                  <p className="text-white/70">
                    High-accuracy transcription using Automatic Speech Recognition converts your audio into text with timestamp precision.
                  </p>
                </div>
                
                <div className="p-8 border-b lg:border-b-0 lg:border-r border-white/10">
                  <h3 className="text-xl font-semibold mb-3 text-brand-purple-light">Content Analysis</h3>
                  <p className="text-white/70">
                    Advanced NLP identifies funny, emotionally charged, thought-provoking and insightful segments.
                  </p>
                </div>
                
                <div className="p-8">
                  <h3 className="text-xl font-semibold mb-3 text-brand-purple-light">Visual Processing</h3>
                  <p className="text-white/70">
                    Smart face tracking and object detection ensures your subjects stay perfectly framed in vertical format.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default AIProcessing;

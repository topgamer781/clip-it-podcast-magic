
import React from "react";
import { Button } from "@/components/ui/button";
import { Upload, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="py-16 md:py-24 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Transform your <span className="gradient-text">podcasts</span> into viral social media clips
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-md">
              Our AI automatically creates engaging, short-form content with captions, animations, and interactive elements.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/dashboard">
                <Button className="btn-gradient h-12 px-6 text-lg group transition-all">
                  <Upload className="mr-2 h-5 w-5 group-hover:animate-bounce-slow" /> 
                  Upload Podcast
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" className="h-12 px-6 text-lg group">
                  <Eye className="mr-2 h-5 w-5 group-hover:animate-pulse-subtle" /> 
                  See how it works
                </Button>
              </Link>
            </div>
            <div className="pt-6 text-sm text-muted-foreground">
              <p>Already trusted by 100+ podcast creators</p>
            </div>
          </div>
          
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-purple/20 rounded-full filter blur-3xl animate-pulse-subtle"></div>
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-brand-blue/20 rounded-full filter blur-3xl animate-pulse-subtle"></div>
              
              <div className="relative bg-brand-dark rounded-2xl p-1 shadow-xl">
                <div className="aspect-[9/16] w-full max-w-[300px] mx-auto bg-black rounded-xl overflow-hidden">
                  <div className="h-full w-full flex items-center justify-center">
                    {/* Mockup of a phone with TikTok style video */}
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 flex flex-col">
                        <div className="flex-grow relative">
                          {/* Video placeholder */}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
                          
                          {/* Captions */}
                          <div className="absolute bottom-24 left-2 right-2 text-center">
                            <div className="bg-black/40 text-white p-2 rounded text-sm">
                              "This AI technology is completely changing the way we create content!"
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

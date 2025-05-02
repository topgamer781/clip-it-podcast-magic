
import React from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const GameOverlay = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <div className="relative">
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-orange/10 rounded-full filter blur-3xl animate-pulse-subtle"></div>
              
              <div className="relative bg-brand-dark rounded-2xl p-6 shadow-xl">
                <div className="aspect-[9/16] w-full max-w-[300px] mx-auto bg-black/40 rounded-xl overflow-hidden">
                  {/* Game overlay showcase */}
                  <div className="h-full w-full p-4 flex flex-col">
                    <div className="flex-grow relative">
                      {/* Mock content area */}
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70"></div>
                    </div>
                    
                    {/* Game overlay examples - animating */}
                    <div className="h-32 relative">
                      {/* Game type 1: Tap the emoji */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full bg-black/30 backdrop-blur-sm rounded-2xl p-4">
                          <div className="text-center text-white text-sm mb-2">TAP THE FIRE EMOJI</div>
                          <div className="flex justify-around">
                            {["😂", "❤️", "🔥", "👍", "🎉"].map((emoji, index) => (
                              <div 
                                key={index} 
                                className={`text-2xl ${emoji === "🔥" ? "animate-bounce-slow" : ""} 
                                  ${emoji === "🔥" ? "bg-white/20 rounded-full p-2" : ""}`}
                              >
                                {emoji}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Alternative game styles shown to the side */}
                <div className="hidden md:flex mt-4 gap-4 justify-center">
                  <div className="bg-black/40 rounded-lg p-2 w-24 h-24 flex items-center justify-center">
                    <div className="text-sm text-white text-center">
                      <div>SWIPE</div>
                      <div className="text-2xl">⬆️</div>
                      <div>TO AGREE</div>
                    </div>
                  </div>
                  
                  <div className="bg-black/40 rounded-lg p-2 w-24 h-24 flex items-center justify-center">
                    <div className="text-sm text-white text-center">
                      <div>WHICH SIDE?</div>
                      <div className="flex justify-between text-xl">
                        <div>🟦</div>
                        <div>🟥</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="lg:w-1/2 space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Interactive Game Overlays</h2>
            <p className="text-lg text-muted-foreground">
              Boost engagement with interactive game elements that keep viewers watching until the end. Our AI automatically generates engaging overlays tailored to your content.
            </p>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="bg-brand-purple/10 p-1 rounded mr-3 mt-1">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-purple">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <span>Emoji reaction games boost engagement and share rates</span>
              </li>
              <li className="flex items-start">
                <div className="bg-brand-purple/10 p-1 rounded mr-3 mt-1">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-purple">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <span>Multiple game templates customized to your content</span>
              </li>
              <li className="flex items-start">
                <div className="bg-brand-purple/10 p-1 rounded mr-3 mt-1">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-purple">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <span>Viewers spend 30% more time watching content with interactive elements</span>
              </li>
            </ul>
            <div className="pt-4">
              <Button className="group">
                Explore Game Templates <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GameOverlay;

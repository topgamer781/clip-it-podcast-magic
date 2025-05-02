
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Rocket, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const CallToAction = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="bg-purple-gradient rounded-2xl p-8 md:p-12 text-white text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to transform your podcast content?</h2>
            <p className="text-lg text-white/80">
              Join hundreds of content creators who are amplifying their reach with AI-powered clips.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth?tab=signup">
                <Button className="bg-white text-brand-purple hover:bg-white/90 h-12 px-8 text-lg">
                  <Rocket className="mr-2 h-4 w-4" />
                  Get Started Free
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" className="text-white border-white hover:bg-white/10 h-12 px-8 text-lg">
                  <Eye className="mr-2 h-4 w-4" /> See Demo
                </Button>
              </Link>
            </div>
            <p className="text-sm text-white/70 pt-4">
              No credit card required • Free plan includes 5 clips per month
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;

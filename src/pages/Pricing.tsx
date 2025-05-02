
import React from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Footer from "@/components/Footer";

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for trying out ClipIt",
    features: [
      "5 clips per month",
      "Basic caption styling",
      "720p export quality",
      "Manual uploads only",
      "Standard processing speed"
    ],
    buttonText: "Start Free",
    buttonVariant: "outline"
  },
  {
    name: "Creator",
    price: "$29",
    period: "/month",
    description: "For serious content creators",
    features: [
      "50 clips per month",
      "Advanced caption styling",
      "1080p export quality",
      "RSS feed integration",
      "Priority processing",
      "Email support"
    ],
    buttonText: "Start 7-Day Trial",
    buttonVariant: "default",
    highlighted: true
  },
  {
    name: "Professional",
    price: "$79",
    period: "/month",
    description: "For podcast networks and studios",
    features: [
      "Unlimited clips",
      "Premium caption styling",
      "4K export quality",
      "YouTube channel integration",
      "Express processing",
      "Priority support",
      "Custom branding"
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline"
  }
];

const Pricing = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Pricing Hero */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose the plan that's right for your podcast needs. No hidden fees, cancel anytime.
            </p>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricingPlans.map((plan, index) => (
                <div 
                  key={index} 
                  className={`rounded-2xl border ${plan.highlighted ? 'border-brand-purple shadow-lg scale-105' : 'border-border/50'} overflow-hidden flex flex-col`}
                >
                  <div className={`p-8 ${plan.highlighted ? 'bg-purple-gradient text-white' : 'bg-card'}`}>
                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline mb-4">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-sm ml-1 opacity-80">{plan.period}</span>
                    </div>
                    <p className={`${plan.highlighted ? 'text-white/80' : 'text-muted-foreground'}`}>{plan.description}</p>
                  </div>
                  <div className="p-8 bg-background flex-grow">
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center">
                          <Check className="h-5 w-5 text-brand-purple mr-3 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${plan.highlighted ? 'bg-purple-gradient hover:bg-purple-600' : ''}`}
                      variant={plan.buttonVariant as any} 
                    >
                      {plan.buttonText}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="p-6 rounded-xl bg-card border border-border/50">
                <h3 className="text-xl font-bold mb-3">How does billing work?</h3>
                <p className="text-muted-foreground">You'll be billed monthly or annually, depending on your preference. You can cancel or change plans at any time.</p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border/50">
                <h3 className="text-xl font-bold mb-3">Can I change plans later?</h3>
                <p className="text-muted-foreground">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border/50">
                <h3 className="text-xl font-bold mb-3">What counts as a "clip"?</h3>
                <p className="text-muted-foreground">A clip is any segment extracted from your podcast, regardless of length (up to 3 minutes per clip).</p>
              </div>
              <div className="p-6 rounded-xl bg-card border border-border/50">
                <h3 className="text-xl font-bold mb-3">Is there a free trial?</h3>
                <p className="text-muted-foreground">Yes! The Free plan is always available, and paid plans come with a 7-day free trial.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;

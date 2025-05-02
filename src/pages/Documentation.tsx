
import React from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText, Code, HelpCircle, Book, ArrowRight } from "lucide-react";
import Footer from "@/components/Footer";

const DocumentationCategories = [
  {
    title: "Getting Started",
    icon: <Book className="h-8 w-8 text-brand-purple" />,
    links: [
      { title: "Quick Start Guide", url: "#" },
      { title: "Account Setup", url: "#" },
      { title: "Upload Your First Podcast", url: "#" },
      { title: "Understanding the Dashboard", url: "#" }
    ]
  },
  {
    title: "Features & Tutorials",
    icon: <FileText className="h-8 w-8 text-brand-purple" />,
    links: [
      { title: "AI Clip Selection", url: "#" },
      { title: "Caption Customization", url: "#" },
      { title: "Game Overlay Options", url: "#" },
      { title: "Export Settings", url: "#" }
    ]
  },
  {
    title: "API Documentation",
    icon: <Code className="h-8 w-8 text-brand-purple" />,
    links: [
      { title: "API Overview", url: "#" },
      { title: "Authentication", url: "#" },
      { title: "Endpoints Reference", url: "#" },
      { title: "Webhooks", url: "#" }
    ]
  },
  {
    title: "Help & Support",
    icon: <HelpCircle className="h-8 w-8 text-brand-purple" />,
    links: [
      { title: "FAQ", url: "#" },
      { title: "Troubleshooting", url: "#" },
      { title: "Contact Support", url: "#" },
      { title: "System Status", url: "#" }
    ]
  }
];

const Documentation = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        {/* Docs Hero */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Documentation</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Everything you need to know about using ClipIt for your podcast clips.
            </p>
            <div className="relative max-w-2xl mx-auto">
              <div className="flex items-center border border-input rounded-md focus-within:ring-1 focus-within:ring-ring bg-background">
                <input
                  type="text"
                  placeholder="Search documentation..."
                  className="flex-1 py-3 px-4 bg-transparent border-none focus:outline-none"
                />
                <Button className="mr-1">Search</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Documentation Categories */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {DocumentationCategories.map((category, index) => (
                <div key={index} className="p-8 rounded-xl border border-border/50 bg-card">
                  <div className="flex items-center mb-6">
                    <div className="mr-4">{category.icon}</div>
                    <h2 className="text-2xl font-bold">{category.title}</h2>
                  </div>
                  <ul className="space-y-3 mb-6">
                    {category.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <a 
                          href={link.url} 
                          className="flex items-center text-foreground hover:text-brand-purple transition-colors"
                        >
                          <ArrowRight className="h-4 w-4 mr-2 text-brand-purple" />
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full border-brand-purple text-brand-purple hover:bg-brand-purple/10">
                    View All
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Guides */}
        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">Popular Guides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <a href="#" className="p-6 rounded-xl bg-card border border-border/50 hover:border-brand-purple hover:shadow-md transition-all">
                <h3 className="text-xl font-bold mb-3">Setting Up RSS Feed</h3>
                <p className="text-muted-foreground mb-4">Learn how to connect your podcast RSS feed for automatic processing.</p>
                <div className="flex items-center text-brand-purple">
                  Read Guide <ExternalLink className="h-4 w-4 ml-2" />
                </div>
              </a>
              <a href="#" className="p-6 rounded-xl bg-card border border-border/50 hover:border-brand-purple hover:shadow-md transition-all">
                <h3 className="text-xl font-bold mb-3">Custom Game Overlays</h3>
                <p className="text-muted-foreground mb-4">Create engaging interactive elements to boost your social media engagement.</p>
                <div className="flex items-center text-brand-purple">
                  Read Guide <ExternalLink className="h-4 w-4 ml-2" />
                </div>
              </a>
              <a href="#" className="p-6 rounded-xl bg-card border border-border/50 hover:border-brand-purple hover:shadow-md transition-all">
                <h3 className="text-xl font-bold mb-3">Batch Processing</h3>
                <p className="text-muted-foreground mb-4">Process multiple podcast episodes at once for efficient clip creation.</p>
                <div className="flex items-center text-brand-purple">
                  Read Guide <ExternalLink className="h-4 w-4 ml-2" />
                </div>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Documentation;

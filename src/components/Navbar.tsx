
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Menu, X, LogIn, UserPlus } from "lucide-react";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="w-full py-4 px-4 sm:px-6 lg:px-8 border-b border-border/40">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-purple-gradient flex items-center justify-center">
            <span className="text-white font-bold text-lg">C</span>
          </div>
          <span className="font-bold text-xl md:text-2xl">ClipIt</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-foreground/80 hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/features" className="text-foreground/80 hover:text-foreground transition-colors">
            Features
          </Link>
          <Link to="/pricing" className="text-foreground/80 hover:text-foreground transition-colors">
            Pricing
          </Link>
          <Link to="/docs" className="text-foreground/80 hover:text-foreground transition-colors">
            Docs
          </Link>
          <Link to="/demo" className="text-foreground/80 hover:text-foreground transition-colors">
            Demo
          </Link>
        </nav>
        
        <div className="flex items-center gap-3">
          <Link to="/auth">
            <Button variant="ghost" className="hidden sm:flex">
              <LogIn className="mr-2 h-4 w-4" />
              Log in
            </Button>
          </Link>
          <Link to="/auth?tab=signup">
            <Button className="bg-purple-gradient hover:bg-purple-600">
              <UserPlus className="mr-2 h-4 w-4" />
              Sign up
            </Button>
          </Link>
          
          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={toggleMobileMenu}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[4.5rem] left-0 right-0 bg-background border-b border-border/40 py-4 px-4 z-50">
          <nav className="flex flex-col space-y-4">
            <Link 
              to="/" 
              className="px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/features" 
              className="px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/pricing" 
              className="px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/docs" 
              className="px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Docs
            </Link>
            <Link 
              to="/demo" 
              className="px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Demo
            </Link>
            <div className="pt-2 flex flex-col space-y-2">
              <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full justify-center">
                  <LogIn className="mr-2 h-4 w-4" />
                  Log in
                </Button>
              </Link>
              <Link to="/auth?tab=signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full justify-center bg-purple-gradient hover:bg-purple-600">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Sign up
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;

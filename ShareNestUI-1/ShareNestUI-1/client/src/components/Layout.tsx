import { Link, useLocation } from "wouter";
import { Leaf, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Explore", href: "/explore" },
    { name: "Donate", href: "/donate" },
    { name: "Request", href: "/request" },
    { name: "Community", href: "/community" },
    { name: "About", href: "/about" },
  ];

  const isActive = (href: string) => {
    return location === href || (href !== "/" && location.startsWith(href));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center" data-testid="link-home-logo">
                <Leaf className="text-primary text-2xl mr-2" />
                <span className="font-bold text-xl text-foreground">Share Nest</span>
              </Link>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-primary"
                        : "text-muted-foreground hover:text-primary"
                    }`}
                    data-testid={`link-nav-${item.name.toLowerCase()}`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              <Button 
                variant="outline" 
                size="sm"
                data-testid="button-sign-in"
              >
                Sign In
              </Button>
              <Button 
                size="sm"
                data-testid="button-join-now"
              >
                Join Now
              </Button>
              
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-border" data-testid="mobile-menu">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`block px-3 py-2 text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground hover:text-primary hover:bg-muted"
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    data-testid={`link-mobile-nav-${item.name.toLowerCase()}`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border text-foreground py-16" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-6">
                <Leaf className="text-primary text-2xl mr-2" />
                <span className="font-bold text-xl">Share Nest</span>
              </div>
              <p className="text-muted-foreground mb-4">
                Building sustainable communities through sharing.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-social-facebook">
                  <span className="sr-only">Facebook</span>
                  <div className="w-5 h-5">📘</div>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-social-twitter">
                  <span className="sr-only">Twitter</span>
                  <div className="w-5 h-5">🐦</div>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-social-instagram">
                  <span className="sr-only">Instagram</span>
                  <div className="w-5 h-5">📸</div>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-social-linkedin">
                  <span className="sr-only">LinkedIn</span>
                  <div className="w-5 h-5">💼</div>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4" data-testid="text-footer-platform-title">Platform</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary transition-colors" data-testid="link-footer-how-it-works">How It Works</Link></li>
                <li><Link href="/donate" className="hover:text-primary transition-colors" data-testid="link-footer-donate">Donate Items</Link></li>
                <li><Link href="/request" className="hover:text-primary transition-colors" data-testid="link-footer-request">Request Items</Link></li>
                <li><Link href="/explore" className="hover:text-primary transition-colors" data-testid="link-footer-marketplace">Browse Marketplace</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4" data-testid="text-footer-community-title">Community</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/community" className="hover:text-primary transition-colors" data-testid="link-footer-local-networks">Local Networks</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors" data-testid="link-footer-partners">Partner Organizations</a></li>
                <li><a href="#" className="hover:text-primary transition-colors" data-testid="link-footer-success-stories">Success Stories</a></li>
                <li><a href="#" className="hover:text-primary transition-colors" data-testid="link-footer-guidelines">Community Guidelines</a></li>
                <li><a href="#" className="hover:text-primary transition-colors" data-testid="link-footer-support">Support Center</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4" data-testid="text-footer-about-title">About</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li><Link href="/about" className="hover:text-primary transition-colors" data-testid="link-footer-mission">Our Mission</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors" data-testid="link-footer-impact-report">Impact Report</a></li>
                <li><Link href="/about" className="hover:text-primary transition-colors" data-testid="link-footer-sdg-goals">SDG Goals</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors" data-testid="link-footer-privacy">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors" data-testid="link-footer-terms">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-12 pt-8">
            <div className="flex flex-col lg:flex-row justify-between items-center">
              <div className="text-muted-foreground text-sm mb-4 lg:mb-0" data-testid="text-footer-copyright">
                © 2024 Share Nest. All rights reserved. Building sustainable communities worldwide.
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-muted-foreground" data-testid="text-footer-sdg-label">Supporting UN SDGs:</span>
                <div className="flex space-x-2">
                  {[1, 11, 12, 13, 17].map((num) => (
                    <div 
                      key={num} 
                      className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center"
                      data-testid={`sdg-badge-${num}`}
                    >
                      <span className="text-xs font-bold text-primary">{num}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

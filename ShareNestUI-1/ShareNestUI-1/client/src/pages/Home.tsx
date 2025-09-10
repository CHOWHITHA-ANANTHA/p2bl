import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, HandHeart, Upload, Handshake, Search, Leaf, Users, Globe, Shield } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import ItemCard from "@/components/ItemCard";
import type { Item, ImpactStats } from "@shared/schema";

export default function Home() {
  const { data: items } = useQuery<Item[]>({
    queryKey: ["/api/items"],
  });

  const { data: impactStats } = useQuery<ImpactStats>({
    queryKey: ["/api/impact"],
  });

  const featuredItems = items?.slice(0, 4) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 lg:py-32" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6" data-testid="text-hero-title">
                Share Nest
                <span className="block text-3xl sm:text-4xl lg:text-5xl mt-2">
                  A community for sharing, donating & borrowing
                </span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-white/90" data-testid="text-hero-subtitle">
                Join thousands of neighbors reducing waste and building stronger communities through sharing.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/donate">
                  <Button 
                    size="lg" 
                    className="bg-white text-primary hover:bg-white/90 shadow-lg"
                    data-testid="button-hero-donate"
                  >
                    <Heart className="mr-2 h-5 w-5" />
                    Donate an Item
                  </Button>
                </Link>
                <Link href="/request">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary"
                    data-testid="button-hero-request"
                  >
                    <HandHeart className="mr-2 h-5 w-5" />
                    Request an Item
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1559027615-cd4628902d4a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Community members sharing items"
                className="rounded-2xl shadow-2xl w-full h-auto"
                data-testid="img-hero-community"
              />
              <div className="absolute -bottom-6 -left-6 bg-white text-foreground p-4 rounded-xl shadow-lg">
                <div className="text-2xl font-bold text-primary" data-testid="text-hero-items-shared">
                  {impactStats?.totalItemsShared?.toLocaleString() || "15,247"}
                </div>
                <div className="text-sm text-muted-foreground">Items Shared</div>
              </div>
              <div className="absolute -top-6 -right-6 bg-white text-foreground p-4 rounded-xl shadow-lg">
                <div className="text-2xl font-bold text-secondary" data-testid="text-hero-co2-saved">
                  {impactStats?.totalCo2Saved || "8.2"} tons
                </div>
                <div className="text-sm text-muted-foreground">CO₂ Saved</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-muted" data-testid="how-it-works-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="text-how-it-works-title">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-how-it-works-subtitle">
              Three simple steps to start building a more sustainable community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center" data-testid="step-donate">
              <div className="bg-primary text-primary-foreground w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">1. Donate</h3>
              <p className="text-muted-foreground">
                Upload photos and details of items you no longer need. Help your neighbors while reducing waste.
              </p>
            </div>
            
            <div className="text-center" data-testid="step-borrow">
              <div className="bg-secondary text-secondary-foreground w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Handshake className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">2. Borrow</h3>
              <p className="text-muted-foreground">
                Browse available items in your area. Connect with neighbors and arrange pickup or delivery.
              </p>
            </div>
            
            <div className="text-center" data-testid="step-request">
              <div className="bg-accent text-accent-foreground w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">3. Request</h3>
              <p className="text-muted-foreground">
                Can't find what you need? Post a request and get notified when someone in your community can help.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-20 bg-background" data-testid="featured-items-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="text-featured-items-title">
                Featured Items
              </h2>
              <p className="text-xl text-muted-foreground" data-testid="text-featured-items-subtitle">
                Discover what's available in your community
              </p>
            </div>
            <Link href="/explore">
              <Button data-testid="button-view-all-items">View All Items</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-20 bg-primary text-primary-foreground" data-testid="impact-stats-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4" data-testid="text-impact-title">
              Our Community Impact
            </h2>
            <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto" data-testid="text-impact-subtitle">
              Together, we're making a real difference for our planet and communities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center" data-testid="stat-items-shared">
              <div className="text-4xl lg:text-5xl font-bold mb-2 impact-counter">
                {impactStats?.totalItemsShared?.toLocaleString() || "15,247"}
              </div>
              <div className="text-lg text-primary-foreground/80">Items Shared</div>
              <div className="text-sm text-primary-foreground/60 mt-1">This month: +1,842</div>
            </div>
            
            <div className="text-center" data-testid="stat-co2-saved">
              <div className="text-4xl lg:text-5xl font-bold mb-2 impact-counter">
                {impactStats?.totalCo2Saved || "8.2"}
              </div>
              <div className="text-lg text-primary-foreground/80">Tons CO₂ Saved</div>
              <div className="text-sm text-primary-foreground/60 mt-1">Equivalent to 127 trees</div>
            </div>
            
            <div className="text-center" data-testid="stat-active-members">
              <div className="text-4xl lg:text-5xl font-bold mb-2 impact-counter">
                {impactStats?.activeMembers?.toLocaleString() || "3,421"}
              </div>
              <div className="text-lg text-primary-foreground/80">Active Members</div>
              <div className="text-sm text-primary-foreground/60 mt-1">Growing daily</div>
            </div>
            
            <div className="text-center" data-testid="stat-money-saved">
              <div className="text-4xl lg:text-5xl font-bold mb-2 impact-counter">
                ${(parseInt(impactStats?.totalMoneySaved || "84000") / 1000).toFixed(0)}K
              </div>
              <div className="text-lg text-primary-foreground/80">Money Saved</div>
              <div className="text-sm text-primary-foreground/60 mt-1">By our community</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-primary text-primary-foreground" data-testid="cta-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6" data-testid="text-cta-title">
            Ready to Make a Difference?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto" data-testid="text-cta-subtitle">
            Join thousands of neighbors who are already sharing, saving money, and protecting our planet.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-white text-primary hover:bg-white/90 shadow-lg"
              data-testid="button-cta-create-account"
            >
              <Users className="mr-2 h-5 w-5" />
              Create Account
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary"
              data-testid="button-cta-watch-demo"
            >
              <span className="mr-2">▶</span>
              Watch How It Works
            </Button>
          </div>
          
          <div className="flex justify-center items-center space-x-8 text-primary-foreground/60">
            <div className="text-center" data-testid="feature-secure">
              <Shield className="h-8 w-8 mx-auto mb-2" />
              <div className="text-sm">Secure</div>
            </div>
            <div className="text-center" data-testid="feature-mobile">
              <div className="h-8 w-8 mx-auto mb-2 flex items-center justify-center">📱</div>
              <div className="text-sm">Mobile Friendly</div>
            </div>
            <div className="text-center" data-testid="feature-global">
              <Globe className="h-8 w-8 mx-auto mb-2" />
              <div className="text-sm">Global Impact</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

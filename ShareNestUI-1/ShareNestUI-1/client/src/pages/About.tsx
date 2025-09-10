import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Recycle, Globe, Building, Users, Scale, Target, Lightbulb } from "lucide-react";
import type { ImpactStats } from "@shared/schema";

export default function About() {
  const { data: impactStats } = useQuery<ImpactStats>({
    queryKey: ["/api/impact"],
  });

  const sdgs = [
    {
      number: 1,
      title: "No Poverty",
      description: "Providing access to essential items for those in need",
      icon: Heart,
      color: "destructive",
    },
    {
      number: 11,
      title: "Sustainable Cities",
      description: "Building resilient and sustainable communities",
      icon: Building,
      color: "accent",
    },
    {
      number: 12,
      title: "Responsible Consumption",
      description: "Promoting reuse and reducing waste in communities",
      icon: Recycle,
      color: "primary",
    },
    {
      number: 13,
      title: "Climate Action",
      description: "Reducing carbon footprint through sharing economy",
      icon: Globe,
      color: "secondary",
    },
    {
      number: 17,
      title: "Partnerships",
      description: "Creating networks for positive social impact",
      icon: Users,
      color: "primary",
    },
    {
      number: 10,
      title: "Reduced Inequalities",
      description: "Ensuring equal access to resources and opportunities",
      icon: Scale,
      color: "secondary",
    },
  ];

  const missionPoints = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To create sustainable communities where sharing is the norm, waste is minimized, and neighbors support each other through resource collaboration.",
    },
    {
      icon: Lightbulb,
      title: "Our Vision",
      description: "A world where every community has access to a sharing network that reduces environmental impact while strengthening social connections.",
    },
    {
      icon: Heart,
      title: "Our Values",
      description: "Sustainability, community, trust, inclusivity, and environmental stewardship guide everything we do at Share Nest.",
    },
  ];

  return (
    <div className="min-h-screen bg-background" data-testid="about-page">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20 lg:py-32" data-testid="about-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6" data-testid="text-hero-title">
            Building Sustainable Communities Together
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto" data-testid="text-hero-subtitle">
            Share Nest is more than a platform—it's a movement toward a more sustainable, connected, and equitable world.
          </p>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-background" data-testid="mission-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {missionPoints.map((point, index) => (
              <Card key={index} className="text-center hover-lift" data-testid={`mission-card-${index}`}>
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <point.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4" data-testid={`text-mission-title-${index}`}>
                    {point.title}
                  </h3>
                  <p className="text-muted-foreground" data-testid={`text-mission-description-${index}`}>
                    {point.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Impact by Numbers */}
      <section className="py-20 bg-muted" data-testid="impact-numbers-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="text-impact-title">
              Our Global Impact
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="text-impact-subtitle">
              Real numbers from real communities making a difference
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center" data-testid="impact-stat-items">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                {impactStats?.totalItemsShared?.toLocaleString() || "15,247"}
              </div>
              <div className="text-lg text-foreground mb-1">Items Shared</div>
              <div className="text-sm text-muted-foreground">Preventing waste globally</div>
            </div>
            
            <div className="text-center" data-testid="impact-stat-co2">
              <div className="text-4xl lg:text-5xl font-bold text-secondary mb-2">
                {impactStats?.totalCo2Saved || "8.2"} tons
              </div>
              <div className="text-lg text-foreground mb-1">CO₂ Prevented</div>
              <div className="text-sm text-muted-foreground">Equivalent to 127 trees planted</div>
            </div>
            
            <div className="text-center" data-testid="impact-stat-communities">
              <div className="text-4xl lg:text-5xl font-bold text-accent mb-2">
                {impactStats?.activeMembers?.toLocaleString() || "3,421"}
              </div>
              <div className="text-lg text-foreground mb-1">Community Members</div>
              <div className="text-sm text-muted-foreground">Across 47 countries</div>
            </div>
            
            <div className="text-center" data-testid="impact-stat-savings">
              <div className="text-4xl lg:text-5xl font-bold text-primary mb-2">
                ${(parseInt(impactStats?.totalMoneySaved || "84000") / 1000).toFixed(0)}K
              </div>
              <div className="text-lg text-foreground mb-1">Money Saved</div>
              <div className="text-sm text-muted-foreground">Kept in local communities</div>
            </div>
          </div>
        </div>
      </section>

      {/* UN SDGs Section */}
      <section className="py-20 bg-background" data-testid="sdgs-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="text-sdgs-title">
              Supporting Global Goals
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-sdgs-subtitle">
              Share Nest contributes to the UN Sustainable Development Goals through community action and environmental stewardship
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sdgs.map((sdg, index) => (
              <Card key={sdg.number} className="hover-lift" data-testid={`sdg-card-${sdg.number}`}>
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className={`w-12 h-12 bg-${sdg.color}/10 rounded-full flex items-center justify-center`}>
                      <span className={`text-lg font-bold text-${sdg.color}`}>{sdg.number}</span>
                    </div>
                    <div className={`w-12 h-12 bg-${sdg.color}/10 rounded-full flex items-center justify-center`}>
                      <sdg.icon className={`h-6 w-6 text-${sdg.color}`} />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold mb-3" data-testid={`text-sdg-title-${sdg.number}`}>
                    {sdg.title}
                  </h3>
                  <p className="text-muted-foreground text-sm" data-testid={`text-sdg-description-${sdg.number}`}>
                    {sdg.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Environmental Impact Details */}
      <section className="py-20 bg-primary text-primary-foreground" data-testid="environmental-impact-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6" data-testid="text-environmental-title">
                Environmental Impact Through Sharing
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-primary-foreground/90" data-testid="text-impact-point-1">
                    <strong>Reduced Manufacturing:</strong> Every shared item means one less new product needs to be manufactured, saving raw materials and energy.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-primary-foreground/90" data-testid="text-impact-point-2">
                    <strong>Lower Transportation:</strong> Local sharing reduces shipping distances and associated carbon emissions.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-primary-foreground/90" data-testid="text-impact-point-3">
                    <strong>Extended Product Life:</strong> Items get maximum use before reaching end-of-life, reducing waste to landfills.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-primary-foreground/90" data-testid="text-impact-point-4">
                    <strong>Community Resilience:</strong> Local resource sharing creates more resilient, self-sufficient communities.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Sustainable living and environmental protection"
                className="rounded-2xl shadow-2xl w-full h-auto"
                data-testid="img-environmental-impact"
              />
              <div className="absolute -bottom-4 -right-4 bg-white text-foreground p-4 rounded-xl shadow-lg">
                <div className="text-lg font-bold text-primary" data-testid="text-impact-metric">
                  92% Less Waste
                </div>
                <div className="text-xs text-muted-foreground">Through sharing</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-background" data-testid="about-cta-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6" data-testid="text-cta-title">
            Be Part of the Solution
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto" data-testid="text-cta-description">
            Every item shared, every connection made, and every act of kindness contributes to a more sustainable future.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" data-testid="button-cta-start-sharing">
              <Heart className="mr-2 h-5 w-5" />
              Start Sharing Today
            </Button>
            <Button size="lg" variant="outline" data-testid="button-cta-learn-more">
              <Lightbulb className="mr-2 h-5 w-5" />
              Learn More About SDGs
            </Button>
          </div>
          
          <div className="flex justify-center items-center space-x-4 text-muted-foreground">
            <span className="text-sm" data-testid="text-footer-sdg-label">Supporting UN SDGs:</span>
            <div className="flex space-x-2">
              {[1, 10, 11, 12, 13, 17].map((num) => (
                <div 
                  key={num} 
                  className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center"
                  data-testid={`footer-sdg-badge-${num}`}
                >
                  <span className="text-xs font-bold text-primary">{num}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

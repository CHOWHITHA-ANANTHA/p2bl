import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Handshake, School, Heart, Leaf } from "lucide-react";
import type { User } from "@shared/schema";

export default function Community() {
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  // Group users by location for community stats
  const communityStats = users ? users.reduce((acc, user) => {
    const location = user.location || "Unknown Location";
    if (!acc[location]) {
      acc[location] = 0;
    }
    acc[location]++;
    return acc;
  }, {} as Record<string, number>) : {};

  const communities = [
    { name: "Downtown District", members: communityStats["Downtown District"] || 245 },
    { name: "Riverside Neighborhood", members: communityStats["Riverside Neighborhood"] || 182 },
    { name: "University Area", members: communityStats["University Area"] || 398 },
  ];

  const partners = [
    { name: "Local Schools Network", icon: School, color: "primary" },
    { name: "Community Food Bank", icon: Heart, color: "secondary" },
    { name: "Green Initiative Groups", icon: Leaf, color: "accent" },
  ];

  return (
    <div className="min-h-screen bg-background py-8" data-testid="community-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="text-page-title">
            Your Local Community
          </h1>
          <p className="text-xl text-muted-foreground" data-testid="text-page-subtitle">
            Connect with neighbors and local organizations
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Community Map Placeholder */}
          <div className="order-2 lg:order-1">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                    alt="Community network map showing connected neighborhoods"
                    className="w-full h-96 object-cover"
                    data-testid="img-community-map"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-semibold mb-1" data-testid="text-map-title">
                      Active Communities
                    </h3>
                    <p className="text-sm opacity-90" data-testid="text-map-subtitle">
                      Join your local sharing network
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Community Information */}
          <div className="order-1 lg:order-2 space-y-6">
            {/* Nearby Communities */}
            <Card data-testid="nearby-communities-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Nearby Communities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {communities.map((community, index) => (
                    <div 
                      key={community.name}
                      className="flex justify-between items-center p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                      data-testid={`community-${index}`}
                    >
                      <span className="font-medium">{community.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {community.members} active members
                      </span>
                    </div>
                  ))}
                </div>
                <Button 
                  className="w-full mt-4"
                  data-testid="button-join-community"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Join Your Local Network
                </Button>
              </CardContent>
            </Card>
            
            {/* Community Partners */}
            <Card data-testid="community-partners-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Handshake className="h-5 w-5 text-secondary" />
                  Community Partners
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {partners.map((partner, index) => (
                    <div 
                      key={partner.name}
                      className="flex items-center p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
                      data-testid={`partner-${index}`}
                    >
                      <div className={`w-10 h-10 bg-${partner.color}/10 rounded-full flex items-center justify-center mr-3`}>
                        <partner.icon className={`h-5 w-5 text-${partner.color}`} />
                      </div>
                      <span className="font-medium">{partner.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Community Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8" data-testid="community-features">
          <Card className="text-center hover-lift">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2" data-testid="text-feature-local-title">
                Local Focus
              </h3>
              <p className="text-muted-foreground text-sm" data-testid="text-feature-local-description">
                Connect with neighbors within walking distance. Build relationships while sharing resources.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover-lift">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-secondary" />
              </div>
              <h3 className="text-lg font-semibold mb-2" data-testid="text-feature-network-title">
                Strong Networks
              </h3>
              <p className="text-muted-foreground text-sm" data-testid="text-feature-network-description">
                Join established community groups and participate in local sustainability initiatives.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center hover-lift">
            <CardContent className="p-6">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2" data-testid="text-feature-impact-title">
                Real Impact
              </h3>
              <p className="text-muted-foreground text-sm" data-testid="text-feature-impact-description">
                See the measurable environmental and social impact of your community's sharing efforts.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Community Guidelines */}
        <div className="mt-16" data-testid="community-guidelines">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-primary" data-testid="text-guidelines-sharing-title">
                    🤝 Sharing Etiquette
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li data-testid="guideline-communication">• Communicate clearly and promptly with other members</li>
                    <li data-testid="guideline-condition">• Accurately describe item condition and availability</li>
                    <li data-testid="guideline-respect">• Treat borrowed items with care and return on time</li>
                    <li data-testid="guideline-gratitude">• Express gratitude and leave positive feedback</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-secondary" data-testid="text-guidelines-safety-title">
                    🛡️ Safety & Trust
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li data-testid="guideline-verification">• Verify member profiles before transactions</li>
                    <li data-testid="guideline-public">• Meet in public spaces when possible</li>
                    <li data-testid="guideline-reporting">• Report any suspicious or inappropriate behavior</li>
                    <li data-testid="guideline-privacy">• Respect privacy and personal boundaries</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center" data-testid="community-cta">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4" data-testid="text-cta-title">
                Ready to Join Your Community?
              </h3>
              <p className="text-primary-foreground/80 mb-6 max-w-2xl mx-auto" data-testid="text-cta-description">
                Start building meaningful connections with your neighbors while making a positive environmental impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-white text-primary hover:bg-white/90"
                  data-testid="button-cta-find-community"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Find My Community
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-white hover:text-primary"
                  data-testid="button-cta-start-network"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Start a Local Network
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

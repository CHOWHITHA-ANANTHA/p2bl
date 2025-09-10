import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, Package, Clock, Star, Edit, Mail, MapPin } from "lucide-react";
import type { User, Item, Request, Transaction } from "@shared/schema";
import ItemCard from "@/components/ItemCard";

export default function Profile() {
  // For demo, using first user
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });
  
  const user = users?.[0];
  const userId = user?.id;

  const { data: userItems } = useQuery<Item[]>({
    queryKey: ["/api/items"],
    select: (items) => items?.filter(item => item.userId === userId) || [],
  });

  const { data: userRequests } = useQuery<Request[]>({
    queryKey: ["/api/requests"],
    select: (requests) => requests?.filter(request => request.userId === userId) || [],
  });

  const { data: userTransactions } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions", "user", userId],
    enabled: !!userId,
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-background py-8" data-testid="profile-loading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse bg-muted h-8 w-48 mx-auto mb-4 rounded"></div>
            <div className="animate-pulse bg-muted h-4 w-64 mx-auto rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const donatedItems = userItems?.filter(item => item.availability === "permanent") || [];
  const loanedItems = userItems?.filter(item => item.availability === "temporary") || [];
  const borrowedTransactions = userTransactions?.filter(t => t.borrowerId === userId) || [];
  const activeRequests = userRequests?.filter(request => request.status === "active") || [];

  return (
    <div className="min-h-screen bg-background py-8" data-testid="profile-page">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card className="mb-8" data-testid="profile-header">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.profilePicture || ""} alt={user.name} />
                  <AvatarFallback className="text-xl">{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold text-foreground mb-1" data-testid="text-user-name">
                    {user.name}
                  </h1>
                  <p className="text-muted-foreground mb-2" data-testid="text-user-username">
                    @{user.username}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      <span data-testid="text-user-email">{user.email}</span>
                    </div>
                    {user.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span data-testid="text-user-location">{user.location}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="ml-auto">
                <Button variant="outline" data-testid="button-edit-profile">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
            </div>
            
            {/* Community Score and Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center p-4 bg-muted rounded-lg" data-testid="stat-community-score">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <span className="text-2xl font-bold">{user.communityScore || 0}</span>
                </div>
                <p className="text-sm text-muted-foreground">Community Score</p>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg" data-testid="stat-items-donated">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Heart className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">{user.itemsDonated || 0}</span>
                </div>
                <p className="text-sm text-muted-foreground">Items Donated</p>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg" data-testid="stat-items-borrowed">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Package className="h-5 w-5 text-secondary" />
                  <span className="text-2xl font-bold">{user.itemsBorrowed || 0}</span>
                </div>
                <p className="text-sm text-muted-foreground">Items Borrowed</p>
              </div>
              
              <div className="text-center p-4 bg-muted rounded-lg" data-testid="stat-co2-saved">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <span className="text-lg">🌱</span>
                  <span className="text-2xl font-bold">{parseFloat(user.co2Saved || "0").toFixed(1)}</span>
                </div>
                <p className="text-sm text-muted-foreground">kg CO₂ Saved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Activity Tabs */}
        <Tabs defaultValue="donated" className="space-y-6" data-testid="profile-tabs">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="donated" data-testid="tab-donated">
              Donated Items ({donatedItems.length})
            </TabsTrigger>
            <TabsTrigger value="borrowed" data-testid="tab-borrowed">
              Borrowed Items ({borrowedTransactions.length})
            </TabsTrigger>
            <TabsTrigger value="requests" data-testid="tab-requests">
              Requests ({activeRequests.length})
            </TabsTrigger>
            <TabsTrigger value="activity" data-testid="tab-activity">
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="donated" className="space-y-6" data-testid="tab-content-donated">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  My Donated Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                {donatedItems.length === 0 ? (
                  <div className="text-center py-8" data-testid="empty-state-donated">
                    <div className="text-4xl mb-4">📦</div>
                    <h3 className="text-lg font-medium mb-2">No donated items yet</h3>
                    <p className="text-muted-foreground mb-4">Start sharing items with your community</p>
                    <Button data-testid="button-donate-first-item">Donate Your First Item</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {donatedItems.map((item) => (
                      <ItemCard key={item.id} item={item} showOwnerActions />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="borrowed" className="space-y-6" data-testid="tab-content-borrowed">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-secondary" />
                  Borrowed Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                {borrowedTransactions.length === 0 ? (
                  <div className="text-center py-8" data-testid="empty-state-borrowed">
                    <div className="text-4xl mb-4">🤝</div>
                    <h3 className="text-lg font-medium mb-2">No borrowed items yet</h3>
                    <p className="text-muted-foreground mb-4">Explore available items in your community</p>
                    <Button data-testid="button-explore-items">Explore Items</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {borrowedTransactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                        data-testid={`borrowed-item-${transaction.id}`}
                      >
                        <div>
                          <h4 className="font-medium">Transaction {transaction.id.slice(0, 8)}</h4>
                          <p className="text-sm text-muted-foreground">
                            Status: <Badge variant="outline">{transaction.status}</Badge>
                          </p>
                        </div>
                        <Button variant="outline" size="sm" data-testid={`button-view-transaction-${transaction.id}`}>
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests" className="space-y-6" data-testid="tab-content-requests">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-accent" />
                  My Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeRequests.length === 0 ? (
                  <div className="text-center py-8" data-testid="empty-state-requests">
                    <div className="text-4xl mb-4">📝</div>
                    <h3 className="text-lg font-medium mb-2">No active requests</h3>
                    <p className="text-muted-foreground mb-4">Let your community know what you need</p>
                    <Button data-testid="button-create-request">Create a Request</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeRequests.map((request) => (
                      <div
                        key={request.id}
                        className="p-4 border border-border rounded-lg"
                        data-testid={`request-${request.id}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium">{request.title}</h4>
                          <Badge variant={
                            request.urgency === "high" ? "destructive" :
                            request.urgency === "medium" ? "default" : "secondary"
                          }>
                            {request.urgency}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{request.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            Posted {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : 'Unknown date'}
                          </span>
                          <Button variant="outline" size="sm" data-testid={`button-view-request-${request.id}`}>
                            View Matches
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6" data-testid="tab-content-activity">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center py-8" data-testid="empty-state-activity">
                    <div className="text-4xl mb-4">📈</div>
                    <h3 className="text-lg font-medium mb-2">Activity history coming soon</h3>
                    <p className="text-muted-foreground">We're working on showing your complete activity timeline</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

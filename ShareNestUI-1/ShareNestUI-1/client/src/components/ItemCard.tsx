import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Heart, Package, MoreHorizontal } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Item } from "@shared/schema";

interface ItemCardProps {
  item: Item;
  showOwnerActions?: boolean;
}

export default function ItemCard({ item, showOwnerActions = false }: ItemCardProps) {
  const getConditionBadge = (condition: string) => {
    switch (condition) {
      case "new":
        return <Badge className="bg-primary/10 text-primary" data-testid="badge-condition-new">Like New</Badge>;
      case "good":
        return <Badge variant="outline" data-testid="badge-condition-good">Good</Badge>;
      case "fair":
        return <Badge variant="secondary" data-testid="badge-condition-fair">Fair</Badge>;
      default:
        return <Badge variant="outline" data-testid="badge-condition-unknown">{condition}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "available":
        return <Badge className="bg-primary/10 text-primary" data-testid="badge-status-available">Available</Badge>;
      case "borrowed":
        return <Badge variant="destructive" data-testid="badge-status-borrowed">Borrowed</Badge>;
      case "unavailable":
        return <Badge variant="secondary" data-testid="badge-status-unavailable">Unavailable</Badge>;
      default:
        return <Badge variant="outline" data-testid="badge-status-unknown">{status}</Badge>;
    }
  };

  const placeholderImages = [
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // Coffee maker
    "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // Books
    "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // Office chair
    "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300", // Yoga equipment
  ];

  const getItemImage = () => {
    if (item.images && item.images.length > 0) {
      return item.images[0];
    }
    // Use a hash of the item ID to consistently assign the same placeholder
    const hash = item.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return placeholderImages[hash % placeholderImages.length];
  };

  return (
    <Card 
      className="overflow-hidden hover-lift" 
      data-testid={`item-card-${item.id}`}
    >
      <div className="relative">
        <img
          src={getItemImage()}
          alt={item.title}
          className="w-full h-48 object-cover"
          data-testid="img-item-photo"
        />
        {showOwnerActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                data-testid="button-item-actions"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem data-testid="action-edit-item">Edit Item</DropdownMenuItem>
              <DropdownMenuItem data-testid="action-mark-unavailable">Mark Unavailable</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" data-testid="action-delete-item">
                Delete Item
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 
            className="font-semibold text-lg line-clamp-1" 
            data-testid="text-item-title"
          >
            {item.title}
          </h3>
          {getStatusBadge(item.status || "available")}
        </div>
        
        <p 
          className="text-muted-foreground text-sm mb-3 line-clamp-2" 
          data-testid="text-item-description"
        >
          {item.description}
        </p>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getConditionBadge(item.condition)}
            <Badge variant="outline" data-testid="badge-item-category">
              {item.category}
            </Badge>
          </div>
          {item.estimatedValue && (
            <span 
              className="text-sm text-muted-foreground" 
              data-testid="text-item-value"
            >
              ~${item.estimatedValue}
            </span>
          )}
        </div>
        
        <div className="flex items-center text-sm text-muted-foreground mb-3">
          <MapPin className="h-4 w-4 mr-1" />
          <span data-testid="text-item-location">{item.location}</span>
        </div>
        
        {item.co2Impact && parseFloat(item.co2Impact) > 0 && (
          <div className="flex items-center text-sm text-muted-foreground mb-3">
            <span className="mr-1">🌱</span>
            <span data-testid="text-item-co2-impact">
              {parseFloat(item.co2Impact).toFixed(1)}kg CO₂ impact
            </span>
          </div>
        )}
        
        {!showOwnerActions && item.status === "available" && (
          <div className="flex gap-2">
            <Button 
              className="flex-1" 
              size="sm"
              data-testid="button-request-item"
            >
              <Heart className="h-4 w-4 mr-1" />
              Request
            </Button>
            <Button 
              variant="outline" 
              className="flex-1" 
              size="sm"
              data-testid="button-borrow-item"
            >
              <Package className="h-4 w-4 mr-1" />
              Borrow
            </Button>
          </div>
        )}
        
        {showOwnerActions && (
          <div className="text-xs text-muted-foreground">
            Posted {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Unknown date'}
            {item.updatedAt && item.updatedAt !== item.createdAt && (
              <span> • Updated {new Date(item.updatedAt).toLocaleDateString()}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

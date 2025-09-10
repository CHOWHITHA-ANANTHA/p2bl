import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";
import ItemCard from "@/components/ItemCard";
import type { Item } from "@shared/schema";

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [selectedLocation, setSelectedLocation] = useState<string>("Within 5 miles");

  const { data: items, isLoading } = useQuery<Item[]>({
    queryKey: ["/api/items", { search: searchQuery, category: selectedCategory === "All Categories" ? undefined : selectedCategory }],
  });

  const { data: categories } = useQuery<string[]>({
    queryKey: ["/api/categories"],
  });

  const filteredItems = items || [];

  return (
    <div className="min-h-screen bg-background py-8" data-testid="explore-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="text-page-title">
            Explore Items
          </h1>
          <p className="text-xl text-muted-foreground" data-testid="text-page-subtitle">
            Discover what's available in your community
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-lg p-6 mb-8 shadow-sm border border-border" data-testid="search-filters">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search for items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[180px]" data-testid="select-category">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Categories">All Categories</SelectItem>
                  {categories?.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-[160px]" data-testid="select-location">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Within 1 mile">Within 1 mile</SelectItem>
                  <SelectItem value="Within 5 miles">Within 5 miles</SelectItem>
                  <SelectItem value="Within 10 miles">Within 10 miles</SelectItem>
                  <SelectItem value="Within 25 miles">Within 25 miles</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Items Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-lg border border-border p-4 animate-pulse" data-testid={`skeleton-item-${i}`}>
                <div className="bg-muted h-48 rounded mb-4"></div>
                <div className="bg-muted h-4 rounded mb-2"></div>
                <div className="bg-muted h-3 rounded mb-3"></div>
                <div className="bg-muted h-8 rounded"></div>
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12" data-testid="empty-state">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground">
              {searchQuery || selectedCategory !== "All Categories" 
                ? "Try adjusting your search or filters" 
                : "Be the first to share an item in your community!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" data-testid="items-grid">
            {filteredItems.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Results Count */}
        {!isLoading && filteredItems.length > 0 && (
          <div className="mt-8 text-center text-muted-foreground" data-testid="results-count">
            Showing {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''}
            {searchQuery && ` for "${searchQuery}"`}
            {selectedCategory !== "All Categories" && ` in ${selectedCategory}`}
          </div>
        )}
      </div>
    </div>
  );
}

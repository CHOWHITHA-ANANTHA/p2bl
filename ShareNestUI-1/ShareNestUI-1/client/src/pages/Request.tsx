import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { NotebookPen, Lightbulb } from "lucide-react";
import { insertRequestSchema } from "@shared/schema";
import type { InsertRequest, Item } from "@shared/schema";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const requestFormSchema = insertRequestSchema;

type RequestFormData = z.infer<typeof requestFormSchema>;

export default function Request() {
  const [selectedUrgency, setSelectedUrgency] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories } = useQuery<string[]>({
    queryKey: ["/api/categories"],
  });

  const form = useForm<RequestFormData>({
    resolver: zodResolver(requestFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      urgency: "",
      location: "",
    },
  });

  const watchedTitle = form.watch("title");
  const watchedCategory = form.watch("category");

  // Get suggested matches based on title and category
  const { data: suggestedMatches } = useQuery<Item[]>({
    queryKey: ["/api/items", { search: watchedTitle, category: watchedCategory }],
    enabled: !!(watchedTitle && watchedTitle.length > 2),
  });

  const createRequestMutation = useMutation({
    mutationFn: async (data: RequestFormData) => {
      return apiRequest("POST", "/api/requests", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      toast({
        title: "Request posted successfully!",
        description: "We'll notify you when someone can help.",
      });
      form.reset();
      setSelectedUrgency("");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to post request",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RequestFormData) => {
    createRequestMutation.mutate({
      ...data,
      urgency: selectedUrgency,
    });
  };

  const urgencyOptions = [
    { value: "low", label: "No rush - within a month", emoji: "📅" },
    { value: "medium", label: "Moderately urgent - within 2 weeks", emoji: "⏰" },
    { value: "high", label: "Urgent - ASAP", emoji: "🚨" },
  ];

  return (
    <div className="min-h-screen bg-muted py-8" data-testid="request-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="text-page-title">
            Request an Item
          </h1>
          <p className="text-xl text-muted-foreground" data-testid="text-page-subtitle">
            Let your community know what you need
          </p>
        </div>
        
        <Card className="shadow-sm border border-border">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" data-testid="request-form">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>What do you need?</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Vacuum cleaner, Baby stroller, Camping tent" 
                              {...field} 
                              data-testid="input-title"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-category">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories?.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    {/* Urgency Level */}
                    <div>
                      <FormLabel className="text-sm font-medium text-foreground mb-2 block">
                        Urgency Level
                      </FormLabel>
                      <div className="space-y-3">
                        {urgencyOptions.map((option) => (
                          <div
                            key={option.value}
                            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                              selectedUrgency === option.value ? 'border-primary bg-primary/5' : 'border-border'
                            }`}
                            onClick={() => setSelectedUrgency(option.value)}
                            data-testid={`urgency-${option.value}`}
                          >
                            <div className="flex items-center w-full">
                              <span className="text-lg mr-3">{option.emoji}</span>
                              <span className="text-sm">{option.label}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description & Details</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={8}
                              placeholder="Describe what you need it for, specific requirements, size, color preferences, etc."
                              {...field}
                              data-testid="textarea-description"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="mt-4">
                      <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Location</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Your neighborhood or zip code" 
                                {...field} 
                                data-testid="input-location"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Suggested Matches */}
                {suggestedMatches && suggestedMatches.length > 0 && (
                  <div className="p-4 bg-accent/10 rounded-lg" data-testid="suggested-matches">
                    <h3 className="font-medium text-foreground mb-2 flex items-center">
                      <Lightbulb className="text-accent mr-2 h-5 w-5" />
                      Suggested Matches
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      We found these similar items near you:
                    </p>
                    <div className="space-y-2">
                      {suggestedMatches.slice(0, 3).map((item) => (
                        <div 
                          key={item.id}
                          className="flex items-center justify-between p-2 bg-card rounded border border-border"
                          data-testid={`suggested-item-${item.id}`}
                        >
                          <span className="text-sm">
                            {item.title} - {item.condition} ({item.location})
                          </span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-primary hover:underline"
                            data-testid={`button-view-item-${item.id}`}
                          >
                            View
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    data-testid="button-save-draft"
                  >
                    Save as Draft
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createRequestMutation.isPending}
                    className="bg-secondary hover:bg-secondary/90"
                    data-testid="button-post-request"
                  >
                    <NotebookPen className="mr-2 h-4 w-4" />
                    {createRequestMutation.isPending ? "Posting..." : "Post Request"}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

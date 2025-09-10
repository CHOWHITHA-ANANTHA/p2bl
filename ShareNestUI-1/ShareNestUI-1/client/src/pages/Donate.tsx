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
import { CloudUpload, Heart } from "lucide-react";
import { insertItemSchema } from "@shared/schema";
import type { InsertItem } from "@shared/schema";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const donateFormSchema = insertItemSchema.extend({
  images: z.array(z.any()).optional(),
});

type DonateFormData = z.infer<typeof donateFormSchema>;

export default function Donate() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories } = useQuery<string[]>({
    queryKey: ["/api/categories"],
  });

  const form = useForm<DonateFormData>({
    resolver: zodResolver(donateFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      condition: "",
      availability: "",
      location: "",
      estimatedValue: "",
    },
  });

  const createItemMutation = useMutation({
    mutationFn: async (data: DonateFormData & { files: File[] }) => {
      const formData = new FormData();
      
      // Append form fields
      Object.entries(data).forEach(([key, value]) => {
        if (key !== 'files' && value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      
      // Append files
      data.files.forEach((file) => {
        formData.append('images', file);
      });

      const response = await fetch('/api/items', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create item');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/items"] });
      queryClient.invalidateQueries({ queryKey: ["/api/impact"] });
      toast({
        title: "Item donated successfully!",
        description: "Your item is now available for the community.",
      });
      form.reset();
      setUploadedFiles([]);
      setSelectedCondition("");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to donate item",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files).filter(file => {
      const isImage = file.type.startsWith('image/');
      const isUnder10MB = file.size <= 10 * 1024 * 1024;
      return isImage && isUnder10MB;
    });
    
    setUploadedFiles(prev => [...prev, ...newFiles].slice(0, 5));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const onSubmit = (data: DonateFormData) => {
    createItemMutation.mutate({
      ...data,
      condition: selectedCondition,
      files: uploadedFiles,
    });
  };

  const conditions = [
    { value: "new", label: "Like New", emoji: "✨" },
    { value: "good", label: "Good", emoji: "👍" },
    { value: "fair", label: "Fair", emoji: "👌" },
  ];

  return (
    <div className="min-h-screen bg-background py-8" data-testid="donate-page">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="text-page-title">
            Donate an Item
          </h1>
          <p className="text-xl text-muted-foreground" data-testid="text-page-subtitle">
            Help your community while reducing waste
          </p>
        </div>
        
        <Card className="shadow-sm border border-border">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8" data-testid="donate-form">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* File Upload */}
                  <div>
                    <FormLabel className="text-sm font-medium text-foreground mb-2 block">
                      Item Photos
                    </FormLabel>
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors upload-zone ${
                        isDragOver ? 'drag-over border-primary bg-primary/5' : 'border-border hover:border-primary'
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => document.getElementById('file-upload')?.click()}
                      data-testid="upload-zone"
                    >
                      <CloudUpload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground mb-2">Click to upload or drag and drop</p>
                      <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB (max 5 files)</p>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleFileUpload(e.target.files)}
                        data-testid="input-file-upload"
                      />
                    </div>
                    
                    {uploadedFiles.length > 0 && (
                      <div className="mt-4" data-testid="uploaded-files-preview">
                        <p className="text-sm text-muted-foreground mb-2">
                          {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} selected
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                          {uploadedFiles.map((file, index) => (
                            <div 
                              key={index} 
                              className="text-xs bg-muted p-2 rounded truncate"
                              data-testid={`uploaded-file-${index}`}
                            >
                              {file.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Form Fields */}
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Item Title</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g., Coffee Maker - Keurig K-Cup" 
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
                    
                    {/* Condition Selection */}
                    <div>
                      <FormLabel className="text-sm font-medium text-foreground mb-2 block">
                        Condition
                      </FormLabel>
                      <div className="grid grid-cols-3 gap-3">
                        {conditions.map((condition) => (
                          <div
                            key={condition.value}
                            className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted condition-option ${
                              selectedCondition === condition.value ? 'selected border-primary bg-primary/10' : 'border-border'
                            }`}
                            onClick={() => setSelectedCondition(condition.value)}
                            data-testid={`condition-${condition.value}`}
                          >
                            <div className="text-center">
                              <div className="text-2xl mb-1">{condition.emoji}</div>
                              <div className="text-sm font-medium">{condition.label}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Describe the item, its features, and any important details..."
                          {...field}
                          data-testid="textarea-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="availability"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Availability</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-availability">
                              <SelectValue placeholder="Select availability" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="permanent">Permanent donation</SelectItem>
                            <SelectItem value="temporary">Temporary loan</SelectItem>
                            <SelectItem value="rental">Short-term rental</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pickup Location</FormLabel>
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
                  
                  <FormField
                    control={form.control}
                    name="estimatedValue"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Estimated Value ($)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            placeholder="50.00" 
                            {...field}
                            value={field.value || ""}
                            data-testid="input-estimated-value"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
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
                    disabled={createItemMutation.isPending}
                    data-testid="button-post-donation"
                  >
                    <Heart className="mr-2 h-4 w-4" />
                    {createItemMutation.isPending ? "Posting..." : "Post Donation"}
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

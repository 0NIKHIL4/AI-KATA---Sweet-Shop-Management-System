import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSweets } from '@/hooks/useSweets';
import { useToast } from '@/hooks/use-toast';
import type { Sweet, SweetCategory, CreateSweetRequest } from '@/types/api.types';
import { Loader2, ImagePlus, X, Link as LinkIcon, Upload } from 'lucide-react';
import { z } from 'zod';

// Import category images for defaults
import chocolatesImg from '@/assets/sweets/chocolates.png';
import candiesImg from '@/assets/sweets/candies.png';
import cookiesImg from '@/assets/sweets/cookies.png';
import cakesImg from '@/assets/sweets/cakes.png';
import pastriesImg from '@/assets/sweets/pastries.png';
import iceCreamImg from '@/assets/sweets/ice-cream.png';
import traditionalImg from '@/assets/sweets/traditional.png';

const getCategoryDefaultImage = (category: string): string => {
  const images: Record<string, string> = {
    chocolates: chocolatesImg,
    candies: candiesImg,
    cookies: cookiesImg,
    cakes: cakesImg,
    pastries: pastriesImg,
    'ice-cream': iceCreamImg,
    traditional: traditionalImg,
  };
  return images[category] || candiesImg;
};

const sweetSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().int().min(0, 'Quantity cannot be negative'),
  description: z.string().max(500, 'Description is too long').optional(),
  imageUrl: z.string().optional(),
});

interface SweetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sweet?: Sweet;
}

export default function SweetFormDialog({ open, onOpenChange, sweet }: SweetFormDialogProps) {
  const { categories, createSweet, updateSweet } = useSweets();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageInputMode, setImageInputMode] = useState<'url' | 'upload'>('url');
  const [imagePreview, setImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '' as SweetCategory | '',
    price: '',
    quantity: '',
    description: '',
    imageUrl: '',
  });

  const isEditMode = !!sweet;

  // Reset form when dialog opens/closes or sweet changes
  useEffect(() => {
    if (open && sweet) {
      setFormData({
        name: sweet.name,
        category: sweet.category,
        price: String(sweet.price),
        quantity: String(sweet.quantity),
        description: sweet.description || '',
        imageUrl: sweet.imageUrl || '',
      });
      setImagePreview(sweet.imageUrl || '');
    } else if (open) {
      setFormData({
        name: '',
        category: '',
        price: '',
        quantity: '',
        description: '',
        imageUrl: '',
      });
      setImagePreview('');
    }
    setErrors({});
    setImageInputMode('url');
  }, [open, sweet]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUrlChange = (url: string) => {
    handleChange('imageUrl', url);
    setImagePreview(url);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file (JPG, PNG, etc.)',
        variant: 'destructive',
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB',
        variant: 'destructive',
      });
      return;
    }

    // Convert to base64 for preview and storage
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setImagePreview(base64);
      handleChange('imageUrl', base64);
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    setImagePreview('');
    handleChange('imageUrl', '');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const data = {
      name: formData.name.trim(),
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      quantity: parseInt(formData.quantity) || 0,
      description: formData.description.trim() || undefined,
      imageUrl: formData.imageUrl.trim() || undefined,
    };

    const result = sweetSchema.safeParse(data);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);
    try {
      if (isEditMode) {
        await updateSweet(sweet.id, data as CreateSweetRequest);
        toast({
          title: 'Sweet updated',
          description: `${data.name} has been updated.`,
        });
      } else {
        await createSweet(data as CreateSweetRequest);
        toast({
          title: 'Sweet added',
          description: `${data.name} has been added to inventory.`,
        });
      }
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Operation failed';
      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const displayImage = imagePreview || (formData.category ? getCategoryDefaultImage(formData.category) : '');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display">
            {isEditMode ? 'Edit Sweet' : 'Add New Sweet'}
          </DialogTitle>
          <DialogDescription>
            {isEditMode ? 'Update the sweet details.' : 'Fill in the details to add a new sweet.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload Section */}
          <div className="space-y-3">
            <Label>Product Image</Label>
            
            {/* Image Preview */}
            <div className="relative">
              {displayImage ? (
                <div className="relative w-full h-40 rounded-xl overflow-hidden border-2 border-border bg-secondary/30">
                  <img
                    src={displayImage}
                    alt="Product preview"
                    className="w-full h-full object-cover"
                    onError={() => setImagePreview('')}
                  />
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={clearImage}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  {!imagePreview && formData.category && (
                    <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-xs text-muted-foreground">
                      Default category image
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  className="w-full h-40 rounded-xl border-2 border-dashed border-border bg-secondary/20 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary/40 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImagePlus className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload or add URL below</p>
                </div>
              )}
            </div>

            {/* Image Input Toggle */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant={imageInputMode === 'url' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setImageInputMode('url')}
                className="flex-1"
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                Image URL
              </Button>
              <Button
                type="button"
                variant={imageInputMode === 'upload' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setImageInputMode('upload')}
                className="flex-1"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </div>

            {/* URL Input */}
            {imageInputMode === 'url' && (
              <Input
                placeholder="https://example.com/image.jpg"
                value={formData.imageUrl.startsWith('data:') ? '' : formData.imageUrl}
                onChange={(e) => handleImageUrlChange(e.target.value)}
                disabled={isLoading}
              />
            )}

            {/* File Upload */}
            {imageInputMode === 'upload' && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isLoading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Image File
                </Button>
                <p className="text-xs text-muted-foreground mt-1 text-center">
                  Max file size: 5MB. Supports JPG, PNG, WebP
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Belgian Dark Chocolate"
              disabled={isLoading}
            />
            {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleChange('category', value)}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price ($) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                placeholder="9.99"
                disabled={isLoading}
              />
              {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => handleChange('quantity', e.target.value)}
                placeholder="50"
                disabled={isLoading}
              />
              {errors.quantity && <p className="text-sm text-destructive">{errors.quantity}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe the sweet..."
              rows={2}
              disabled={isLoading}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
          </div>

          <DialogFooter className="pt-4">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="candy" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? 'Save Changes' : 'Add Sweet'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

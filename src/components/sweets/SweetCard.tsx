import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useSweets } from '@/hooks/useSweets';
import { useToast } from '@/hooks/use-toast';
import type { Sweet } from '@/types/api.types';
import { ShoppingCart, Edit, Trash2, Plus } from 'lucide-react';
import SweetFormDialog from './SweetFormDialog';
import RestockDialog from './RestockDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';

// Import category images
import chocolatesImg from '@/assets/sweets/chocolates.png';
import candiesImg from '@/assets/sweets/candies.png';
import cookiesImg from '@/assets/sweets/cookies.png';
import cakesImg from '@/assets/sweets/cakes.png';
import pastriesImg from '@/assets/sweets/pastries.png';
import iceCreamImg from '@/assets/sweets/ice-cream.png';
import traditionalImg from '@/assets/sweets/traditional.png';

interface SweetCardProps {
  sweet: Sweet;
}

const getCategoryImage = (category: string): string => {
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

const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    chocolates: 'bg-amber-50 text-amber-700 border-amber-200',
    candies: 'bg-pink-50 text-pink-600 border-pink-200',
    cookies: 'bg-orange-50 text-orange-600 border-orange-200',
    cakes: 'bg-purple-50 text-purple-600 border-purple-200',
    pastries: 'bg-rose-50 text-rose-600 border-rose-200',
    'ice-cream': 'bg-cyan-50 text-cyan-600 border-cyan-200',
    traditional: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  };
  return colors[category] || 'bg-secondary text-secondary-foreground';
};

const getCategoryEmoji = (category: string) => {
  const emojis: Record<string, string> = {
    chocolates: '🍫',
    candies: '🍬',
    cookies: '🍪',
    cakes: '🎂',
    pastries: '🥐',
    'ice-cream': '🍦',
    traditional: '🍯',
  };
  return emojis[category] || '🍭';
};

export default function SweetCard({ sweet }: SweetCardProps) {
  const { isAdmin } = useAuth();
  const { purchaseSweet, deleteSweet } = useSweets();
  const { toast } = useToast();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRestockOpen, setIsRestockOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const isOutOfStock = sweet.quantity === 0;
  const isLowStock = sweet.quantity > 0 && sweet.quantity <= 5;

  const handlePurchase = async () => {
    if (isOutOfStock) return;
    
    setIsPurchasing(true);
    try {
      await purchaseSweet(sweet.id);
      toast({
        title: 'Purchase successful!',
        description: `You bought 1x ${sweet.name}`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to purchase';
      toast({
        title: 'Purchase failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSweet(sweet.id);
      toast({
        title: 'Sweet deleted',
        description: `${sweet.name} has been removed.`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete';
      toast({
        title: 'Delete failed',
        description: message,
        variant: 'destructive',
      });
    }
  };

  return (
    <>
      <Card className="group overflow-hidden animate-scale-in">
        {/* Product Image */}
        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-secondary to-muted">
          <img
            src={sweet.imageUrl || getCategoryImage(sweet.category)}
            alt={sweet.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          {/* Stock Badge Overlay */}
          <div className="absolute top-3 right-3">
            {isOutOfStock ? (
              <Badge variant="destructive" className="shadow-lg">Out of Stock</Badge>
            ) : isLowStock ? (
              <Badge className="bg-warning text-warning-foreground shadow-lg">Low: {sweet.quantity}</Badge>
            ) : (
              <Badge className="bg-success/90 text-success-foreground shadow-lg">
                {sweet.quantity} left
              </Badge>
            )}
          </div>
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="outline" className={`${getCategoryColor(sweet.category)} shadow-sm backdrop-blur-sm`}>
              {getCategoryEmoji(sweet.category)} {sweet.category}
            </Badge>
          </div>
        </div>

        {/* Sweet Info */}
        <CardContent className="p-4">
          <div className="space-y-3">
            <div>
              <h3 className="font-display text-lg font-bold text-foreground group-hover:text-candy transition-colors line-clamp-1">
                {sweet.name}
              </h3>
              {sweet.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {sweet.description}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-2xl font-display font-bold text-primary">
                ${sweet.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-4 space-y-2">
            <Button
              variant={isOutOfStock ? 'outline' : 'candy'}
              size="lg"
              className="w-full"
              disabled={isOutOfStock || isPurchasing}
              onClick={handlePurchase}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {isPurchasing ? 'Processing...' : isOutOfStock ? 'Out of Stock' : 'Purchase'}
            </Button>

            {/* Admin Actions */}
            {isAdmin && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => setIsEditOpen(true)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant="mint"
                  size="sm"
                  className="flex-1"
                  onClick={() => setIsRestockOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Restock
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsDeleteOpen(true)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <SweetFormDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        sweet={sweet}
      />
      <RestockDialog
        open={isRestockOpen}
        onOpenChange={setIsRestockOpen}
        sweet={sweet}
      />
      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        sweetName={sweet.name}
        onConfirm={handleDelete}
      />
    </>
  );
}

import { useState } from 'react';
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
import { useSweets } from '@/hooks/useSweets';
import { useToast } from '@/hooks/use-toast';
import type { Sweet } from '@/types/api.types';
import { Loader2, Package } from 'lucide-react';

interface RestockDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sweet: Sweet;
}

export default function RestockDialog({ open, onOpenChange, sweet }: RestockDialogProps) {
  const { restockSweet } = useSweets();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const qty = parseInt(quantity);
    if (!qty || qty <= 0) {
      setError('Please enter a valid quantity greater than 0');
      return;
    }

    setIsLoading(true);
    try {
      await restockSweet(sweet.id, qty);
      toast({
        title: 'Restocked!',
        description: `Added ${qty} units to ${sweet.name}. New stock: ${sweet.quantity + qty}`,
      });
      setQuantity('');
      onOpenChange(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to restock';
      toast({
        title: 'Restock failed',
        description: message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <Package className="h-5 w-5 text-success" />
            Restock Sweet
          </DialogTitle>
          <DialogDescription>
            Add more units to <strong>{sweet.name}</strong><br />
            Current stock: <strong>{sweet.quantity}</strong>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity to Add *</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => {
                setQuantity(e.target.value);
                setError('');
              }}
              placeholder="Enter quantity"
              disabled={isLoading}
              autoFocus
            />
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="success" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Restock
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

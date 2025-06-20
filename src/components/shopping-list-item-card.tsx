"use client";

import { useShoppingList } from '@/contexts/shopping-list-context';
import type { ShoppingListItem, ShoppingItemStatus } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, User, CalendarDays, BarChart3, Hash } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '@/hooks/use-toast';

interface ShoppingListItemCardProps {
  item: ShoppingListItem;
}

const priorityStyles: Record<string, string> = {
  baixa: "bg-blue-200 text-blue-800",
  média: "bg-yellow-200 text-yellow-800",
  alta: "bg-red-200 text-red-800",
};

export function ShoppingListItemCard({ item }: ShoppingListItemCardProps) {
  const { state, dispatch } = useShoppingList();
  const { toast } = useToast();
  const product = state.products.find(p => p.id === item.productId);
  const user = state.users.find(u => u.id === item.userId);

  if (!product || !user) return null;
  
  const handleStatusChange = (status: ShoppingItemStatus) => {
    dispatch({ type: 'UPDATE_SHOPPING_ITEM_STATUS', payload: { id: item.id, status } });
  };
  
  const handleRemove = () => {
    dispatch({ type: 'REMOVE_SHOPPING_ITEM', payload: { id: item.id } });
    toast({ variant: 'destructive', title: 'Item Removido', description: `${product.name} foi removido da lista.` });
  };

  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <Badge variant="secondary" className="text-xs">{product.category}</Badge>
        </div>
        <div className="flex items-center gap-2">
            <Select value={item.status} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[130px] h-8 text-xs">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="a comprar">A Comprar</SelectItem>
                    <SelectItem value="comprando">Comprando</SelectItem>
                    <SelectItem value="comprado">Comprado</SelectItem>
                </SelectContent>
            </Select>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleRemove}>
                <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-2xl font-bold text-primary">R$ {(product.price * item.quantity).toFixed(2)}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
                <Hash className="h-4 w-4"/>
                <span>{item.quantity} unidade(s)</span>
            </div>
             <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4"/>
                <Badge variant="outline" className={priorityStyles[item.priority]}>{item.priority}</Badge>
            </div>
            <div className="flex items-center gap-2">
                <User className="h-4 w-4"/>
                <span>{user.name}</span>
            </div>
            <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4"/>
                <span>{new Date(item.dateAdded).toLocaleDateString()}</span>
            </div>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useShoppingList } from '@/contexts/shopping-list-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Package, PackagePlus, Trash2 } from 'lucide-react';
import type { ProductCategory } from '@/lib/types';

const productSchema = z.object({
  name: z.string().min(1, 'Nome do produto é obrigatório'),
  category: z.enum(['alimentos', 'limpeza', 'higiene', 'outros'], { required_error: 'Categoria é obrigatória' }),
  price: z.coerce.number().min(0.01, 'Preço deve ser maior que zero'),
});

type ProductFormData = z.infer<typeof productSchema>;
const categories: ProductCategory[] = ['alimentos', 'limpeza', 'higiene', 'outros'];

export function ProductManager() {
  const { state, dispatch } = useShoppingList();
  const { toast } = useToast();

  const form = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: '', price: 0 },
  });

  const onSubmit = (data: ProductFormData) => {
    if (state.products.some(p => p.name.toLowerCase() === data.name.toLowerCase())) {
        form.setError('name', { type: 'manual', message: 'Este produto já existe.' });
        return;
    }
    
    dispatch({
      type: 'ADD_PRODUCT',
      payload: { ...data, id: new Date().toISOString() },
    });
    toast({ title: 'Produto adicionado!', description: `${data.name} foi adicionado.` });
    form.reset();
  };
  
  const removeProduct = (id: string, name: string) => {
    dispatch({ type: 'REMOVE_PRODUCT', payload: { id } });
    toast({ variant: "destructive", title: 'Produto removido!', description: `${name} foi removido.` });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
            <Package className="h-6 w-6 text-accent" />
            <CardTitle>Gerenciar Produtos</CardTitle>
        </div>
        <CardDescription>Adicione ou remova produtos disponíveis.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Produto</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Leite" {...field} />
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
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(cat => <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço (R$)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="12.99" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
                <PackagePlus className="mr-2 h-4 w-4"/>
                Adicionar Produto
            </Button>
          </form>
        </Form>
        <Separator className="my-4" />
        <h3 className="text-sm font-medium mb-2">Produtos Cadastrados</h3>
        <ScrollArea className="h-40">
          <div className="space-y-2">
            {state.products.length > 0 ? (
              state.products.map(product => (
                <div key={product.id} className="flex items-center justify-between rounded-md border p-2">
                   <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">R$ {product.price.toFixed(2)}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeProduct(product.id, product.name)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center">Nenhum produto cadastrado.</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

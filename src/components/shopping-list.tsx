"use client";

import { useShoppingList } from '@/contexts/shopping-list-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { ShoppingItemPriority, ShoppingListItem } from '@/lib/types';
import { ShoppingListItemCard } from './shopping-list-item-card';
import { Input } from './ui/input';
import { ListPlus, ShoppingCart, Filter } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

const itemSchema = z.object({
  productId: z.string().min(1, 'Selecione um produto'),
  userId: z.string().min(1, 'Selecione um usuário'),
  quantity: z.coerce.number().int().min(1, 'Quantidade deve ser no mínimo 1'),
  priority: z.enum(['baixa', 'média', 'alta'], { required_error: 'Prioridade é obrigatória' }),
});

type ItemFormData = z.infer<typeof itemSchema>;

const priorities: ShoppingItemPriority[] = ['baixa', 'média', 'alta'];

export function ShoppingList() {
  const { state, dispatch } = useShoppingList();
  const { toast } = useToast();
  const [userFilter, setUserFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: { quantity: 1 },
  });

  const onSubmit = (data: ItemFormData) => {
    if (state.shoppingList.some(item => item.productId === data.productId)) {
        toast({ variant: "destructive", title: 'Item já existe!', description: 'Este produto já está na sua lista.' });
        return;
    }

    const newItem: ShoppingListItem = {
      ...data,
      id: new Date().toISOString(),
      dateAdded: new Date(),
      status: 'a comprar',
      priority: data.priority as ShoppingItemPriority,
    };

    dispatch({ type: 'ADD_SHOPPING_ITEM', payload: newItem });
    toast({ title: 'Item adicionado!', description: 'Novo item na sua lista de compras.' });
    form.reset({ quantity: 1, priority: undefined, productId: undefined, userId: undefined });
  };
  
  const filteredList = useMemo(() => {
    return state.shoppingList
      .filter(item => userFilter === 'all' || item.userId === userFilter)
      .filter(item => priorityFilter === 'all' || item.priority === priorityFilter)
      .filter(item => statusFilter === 'all' || item.status === statusFilter);
  }, [state.shoppingList, userFilter, priorityFilter, statusFilter]);

  const sortedList = useMemo(() => {
    const priorityOrder: Record<ShoppingItemPriority, number> = { 'alta': 3, 'média': 2, 'baixa': 1 };
    return [...filteredList].sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority] || a.dateAdded.getTime() - b.dateAdded.getTime());
  }, [filteredList]);

  const sections = {
    'a comprar': sortedList.filter(i => i.status === 'a comprar'),
    'comprando': sortedList.filter(i => i.status === 'comprando'),
    'comprado': sortedList.filter(i => i.status === 'comprado'),
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-center gap-3">
          <ShoppingCart className="h-6 w-6 text-accent" />
          <CardTitle>Lista de Compras</CardTitle>
        </div>
        <CardDescription>Adicione e organize os itens que precisa comprar.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col gap-4">
        <Card>
          <CardHeader className='pb-2'>
              <div className='flex items-center gap-2'>
                  <ListPlus className="h-5 w-5"/>
                  <h3 className="font-semibold">Adicionar Novo Item</h3>
              </div>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <FormField control={form.control} name="productId" render={({ field }) => (
                  <FormItem><FormLabel>Produto</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl><SelectContent>{state.products.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="userId" render={({ field }) => (
                  <FormItem><FormLabel>Usuário</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl><SelectContent>{state.users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="quantity" render={({ field }) => (
                  <FormItem><FormLabel>Quantidade</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="priority" render={({ field }) => (
                  <FormItem><FormLabel>Prioridade</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger></FormControl><SelectContent>{priorities.map(p => <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                )} />
                <Button type="submit" className="sm:col-span-2 md:col-span-3 w-full bg-accent hover:bg-accent/90">Adicionar à Lista</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <Separator/>

        <div className='space-y-4'>
            <div className="flex items-center gap-2">
                <Filter className="h-5 w-5"/>
                <h3 className="font-semibold">Filtros</h3>
            </div>
            <div className="flex flex-wrap gap-4">
              <Select value={userFilter} onValueChange={setUserFilter}><SelectTrigger className="w-[180px]"><SelectValue placeholder="Filtrar por usuário" /></SelectTrigger><SelectContent><SelectItem value="all">Todos os Usuários</SelectItem>{state.users.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent></Select>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}><SelectTrigger className="w-[180px]"><SelectValue placeholder="Filtrar por prioridade" /></SelectTrigger><SelectContent><SelectItem value="all">Todas as Prioridades</SelectItem>{priorities.map(p => <SelectItem key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</SelectItem>)}</SelectContent></Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}><SelectTrigger className="w-[180px]"><SelectValue placeholder="Filtrar por status" /></SelectTrigger><SelectContent><SelectItem value="all">Todos os Status</SelectItem><SelectItem value="a comprar">A Comprar</SelectItem><SelectItem value="comprando">Comprando</SelectItem><SelectItem value="comprado">Comprado</SelectItem></SelectContent></Select>
            </div>
        </div>

        <div className="flex-grow space-y-4 overflow-y-auto">
            {Object.entries(sections).map(([status, items]) => items.length > 0 && (
                <div key={status}>
                    <Badge variant={status === 'comprado' ? 'secondary' : 'default'} className={status === 'comprado' ? '' : 'bg-primary/80'}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
                    <div className="mt-2 grid gap-4 sm:grid-cols-1 lg:grid-cols-2">
                        {items.map(item => <ShoppingListItemCard key={item.id} item={item} />)}
                    </div>
                </div>
            ))}

            {sortedList.length === 0 && (
                 <div className="text-center text-muted-foreground pt-10">
                    <ShoppingCart className="mx-auto h-12 w-12" />
                    <p className="mt-4">Sua lista de compras está vazia.</p>
                    <p className="text-sm">Adicione um item para começar!</p>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}

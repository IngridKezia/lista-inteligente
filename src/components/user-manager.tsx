"use client";

import { useShoppingList } from '@/contexts/shopping-list-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { AtSign, Trash2, UserPlus, Users } from 'lucide-react';

const userSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  email: z.string().email('E-mail inválido'),
});

type UserFormData = z.infer<typeof userSchema>;

export function UserManager() {
  const { state, dispatch } = useShoppingList();
  const { toast } = useToast();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: '', email: '' },
  });

  const onSubmit = (data: UserFormData) => {
    dispatch({
      type: 'ADD_USER',
      payload: { ...data, id: new Date().toISOString() },
    });
    toast({ title: 'Usuário adicionado!', description: `${data.name} foi adicionado à lista.` });
    form.reset();
  };

  const removeUser = (id: string, name: string) => {
    dispatch({ type: 'REMOVE_USER', payload: { id } });
    toast({ variant: "destructive", title: 'Usuário removido!', description: `${name} foi removido.` });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-accent" />
          <CardTitle>Gerenciar Usuários</CardTitle>
        </div>
        <CardDescription>Adicione ou remova membros da família.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do membro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90">
              <UserPlus className="mr-2 h-4 w-4" />
              Adicionar Usuário
            </Button>
          </form>
        </Form>
        <Separator className="my-4" />
        <h3 className="text-sm font-medium mb-2">Usuários Atuais</h3>
        <ScrollArea className="h-40">
          <div className="space-y-2">
            {state.users.length > 0 ? (
              state.users.map(user => (
                <div key={user.id} className="flex items-center justify-between rounded-md border p-2">
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <div className="flex items-center text-muted-foreground">
                       <AtSign className="h-3 w-3 mr-1"/>
                       <p className="text-xs">{user.email}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeUser(user.id, user.name)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground text-center">Nenhum usuário cadastrado.</p>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

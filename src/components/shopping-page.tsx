"use client";

import { ListPlus } from 'lucide-react';
import { UserManager } from './user-manager';
import { ProductManager } from './product-manager';
import { ShoppingList } from './shopping-list';

export function ShoppingPage() {
  return (
    <div className="min-h-screen w-full">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur md:px-6">
        <div className="flex items-center gap-2">
          <ListPlus className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Lista Inteligente
          </h1>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="grid gap-6 xl:grid-cols-3">
          <div className="flex flex-col gap-6 xl:col-span-1">
            <UserManager />
            <ProductManager />
          </div>
          <div className="xl:col-span-2">
            <ShoppingList />
          </div>
        </div>
      </main>
    </div>
  );
}

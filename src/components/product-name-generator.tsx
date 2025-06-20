"use client";

import { useState, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { generateProductNameSuggestions } from '@/ai/flows/generate-product-name-suggestions';
import { Loader, Sparkles } from 'lucide-react';
import { Badge } from './ui/badge';
import type { ProductCategory } from '@/lib/types';
import { Card, CardContent } from './ui/card';

interface ProductNameGeneratorProps {
  children: ReactNode;
  onSelectName: (name: string) => void;
}

const categories: ProductCategory[] = ['alimentos', 'limpeza', 'higiene', 'outros'];

export function ProductNameGenerator({ children, onSelectName }: ProductNameGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!selectedCategory) {
      toast({ variant: 'destructive', title: 'Erro', description: 'Por favor, selecione uma categoria.' });
      return;
    }
    setIsLoading(true);
    setSuggestions([]);
    try {
      const result = await generateProductNameSuggestions({ category: selectedCategory });
      setSuggestions(result.suggestions);
    } catch (error) {
      toast({ variant: 'destructive', title: 'Erro de Geração', description: 'Não foi possível gerar sugestões.' });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSuggestion = (name: string) => {
    onSelectName(name);
    setIsOpen(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-6 w-6 text-accent" />
            <DialogTitle>Gerador de Nomes de Produtos</DialogTitle>
          </div>
          <DialogDescription>
            Selecione uma categoria e nós sugerimos alguns nomes criativos para seu produto.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Select onValueChange={(value: ProductCategory) => setSelectedCategory(value)}>
                <SelectTrigger className="col-span-4">
                    <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</SelectItem>)}
                </SelectContent>
            </Select>
          </div>
          <Button onClick={handleGenerate} disabled={isLoading || !selectedCategory} className="w-full bg-accent hover:bg-accent/90">
            {isLoading ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            Gerar Sugestões
          </Button>

          {suggestions.length > 0 && (
            <Card>
                <CardContent className="p-4">
                    <h4 className="text-sm font-semibold mb-2">Sugestões:</h4>
                    <div className="flex flex-wrap gap-2">
                        {suggestions.map((name, index) => (
                            <Badge
                                key={index}
                                variant="outline"
                                className="cursor-pointer text-accent border-accent hover:bg-accent/10"
                                onClick={() => handleSelectSuggestion(name)}
                            >
                                {name}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

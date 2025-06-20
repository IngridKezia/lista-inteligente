import { ShoppingListProvider } from '@/contexts/shopping-list-context';
import { ShoppingPage } from '@/components/shopping-page';

export default function Home() {
  return (
    <ShoppingListProvider>
      <ShoppingPage />
    </ShoppingListProvider>
  );
}

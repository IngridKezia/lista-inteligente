export type ProductCategory = 'alimentos' | 'limpeza' | 'higiene' | 'outros';

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
}

export type ShoppingItemStatus = 'a comprar' | 'comprando' | 'comprado';
export type ShoppingItemPriority = 'baixa' | 'média' | 'alta';

export interface ShoppingListItem {
  id: string;
  productId: string;
  userId: string;
  quantity: number;
  priority: ShoppingItemPriority;
  dateAdded: Date;
  status: ShoppingItemStatus;
}

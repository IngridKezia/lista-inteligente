"use client";

import type { ReactNode } from "react";
import React, { createContext, useContext, useReducer } from 'react';
import type { User, Product, ShoppingListItem, ShoppingItemStatus, ShoppingItemPriority } from '@/lib/types';

interface State {
  users: User[];
  products: Product[];
  shoppingList: ShoppingListItem[];
}

type Action =
  | { type: 'ADD_USER'; payload: User }
  | { type: 'REMOVE_USER'; payload: { id: string } }
  | { type: 'ADD_PRODUCT'; payload: Product }
  | { type: 'REMOVE_PRODUCT'; payload: { id: string } }
  | { type: 'ADD_SHOPPING_ITEM'; payload: ShoppingListItem }
  | { type: 'REMOVE_SHOPPING_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_SHOPPING_ITEM_STATUS'; payload: { id: string; status: ShoppingItemStatus } };

const initialState: State = {
  users: [
    { id: '1', name: 'Alice', email: 'alice@example.com'},
    { id: '2', name: 'Bob', email: 'bob@example.com'},
  ],
  products: [
    { id: '101', name: 'Maçãs', category: 'alimentos', price: 5.50 },
    { id: '102', name: 'Sabão em pó', category: 'limpeza', price: 12.00 },
    { id: '103', name: 'Pasta de dente', category: 'higiene', price: 3.75 },
    { id: '104', name: 'Baterias', category: 'outros', price: 15.00 },
  ],
  shoppingList: [],
};

const ShoppingListContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

const shoppingListReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_USER':
      return { ...state, users: [...state.users, action.payload] };
    case 'REMOVE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload.id),
        shoppingList: state.shoppingList.filter(item => item.userId !== action.payload.id),
      };
    case 'ADD_PRODUCT':
      return { ...state, products: [...state.products, action.payload] };
    case 'REMOVE_PRODUCT':
       return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload.id),
        shoppingList: state.shoppingList.filter(item => item.productId !== action.payload.id),
      };
    case 'ADD_SHOPPING_ITEM':
      return { ...state, shoppingList: [...state.shoppingList, action.payload] };
    case 'REMOVE_SHOPPING_ITEM':
      return {
        ...state,
        shoppingList: state.shoppingList.filter(item => item.id !== action.payload.id),
      };
    case 'UPDATE_SHOPPING_ITEM_STATUS':
      return {
        ...state,
        shoppingList: state.shoppingList.map(item =>
          item.id === action.payload.id ? { ...item, status: action.payload.status } : item
        ),
      };
    default:
      return state;
  }
};

export const ShoppingListProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(shoppingListReducer, initialState);

  return (
    <ShoppingListContext.Provider value={{ state, dispatch }}>
      {children}
    </ShoppingListContext.Provider>
  );
};

export const useShoppingList = () => {
  const context = useContext(ShoppingListContext);
  if (context === undefined) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
};

import { createContext } from 'react';
import type { Product } from './types/Product';

interface CartItem {
    product: Product;
    quantity: number;
}

interface CartContextType {
    cart: CartItem[];
    addToCart: (product: Product, quantity: number) => void;
    removeFromCart: (productId: number) => void;
    cartTotal: number;
    itemCount: number;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);
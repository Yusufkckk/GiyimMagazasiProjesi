import * as React from 'react'; // Bu satýrý kullan
import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Product } from './types/Product';
import { CartContext } from './CartContext';
interface CartItem {
    product: Product;
    quantity: number;
}

// CartContextType artýk gereksiz, çünkü onu zaten CartContext dosyasýndan import ediyoruz.
// Ancak kodun daha anlaþýlýr olmasý için býrakabiliriz.
// interface CartContextType {
//  cart: CartItem[];
//  addToCart: (product: Product, quantity: number) => void;
// }

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [cart, setCart] = useState<CartItem[]>([]);

    const addToCart = (product: Product, quantity: number) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.product.id === product.id);
            if (existingItem) {
                return prevCart.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            } else {
                return [...prevCart, { product, quantity }];
            }
        });
    };

    return (
        <CartContext.Provider value={{ cart, addToCart }}>
            {children}
        </CartContext.Provider>
    );
};
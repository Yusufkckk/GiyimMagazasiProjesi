import * as React from 'react'; // Bu satýrý kullan
import { useState } from 'react';
import type { ReactNode } from 'react';
import type { Product } from './types/Product';
import { CartContext } from './CartContext';
interface CartItem {
    product: Product;
    quantity: number;
}




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

    const removeFromCart = (productId: number) => {
        setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId: number, newQuantity: number) => {
        setCart(prevCart => {
            if (newQuantity <= 0) {
                return prevCart.filter(item => item.product.id !== productId);
            }

            return prevCart.map(item =>
                item.product.id === productId
                    ? { ...item, quantity: newQuantity }
                    : item
            );
        });
    };

    // Sepeti temizleme fonksiyonu eklendi
    const clearCart = () => {
        setCart([]);
    };

    const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

    const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount }}>
            {children}
        </CartContext.Provider>
    );
};
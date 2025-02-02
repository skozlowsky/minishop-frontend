import { useState, useEffect } from 'react';
import { OrderItem } from '../types/api';

export function useCart() {
    const [items, setItems] = useState<OrderItem[]>([]);

    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setItems(JSON.parse(savedCart));
        }
    }, []);

    const addItem = (item: OrderItem) => {
        setItems(currentItems => {
            const existingItem = currentItems.find(i => i.productId === item.productId);
            let newItems;

            if (existingItem) {
                newItems = currentItems.map(i =>
                    i.productId === item.productId
                        ? { ...i, quantity: i.quantity + item.quantity }
                        : i
                );
            } else {
                newItems = [...currentItems, item];
            }

            localStorage.setItem('cart', JSON.stringify(newItems));
            return newItems;
        });
    };

    const removeItem = (productId: string) => {
        setItems(currentItems => {
            const newItems = currentItems.filter(item => item.productId !== productId);
            localStorage.setItem('cart', JSON.stringify(newItems));
            return newItems;
        });
    };

    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) return;

        setItems(currentItems => {
            const newItems = currentItems.map(item =>
                item.productId === productId ? { ...item, quantity } : item
            );
            localStorage.setItem('cart', JSON.stringify(newItems));
            return newItems;
        });
    };

    const clearCart = () => {
        localStorage.removeItem('cart');
        setItems([]);
    };

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        total,
    };
}
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';

interface CartItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
}

export function Cart() {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        const items = JSON.parse(localStorage.getItem('cart') || '[]');
        setCartItems(items);
    }, []);

    const createOrder = useMutation({
        mutationFn: async (items: CartItem[]) => {
            const response = await apiClient.post('/api/orders', {
                items: items.map(item => ({
                    productId: item.productId,
                    productName: item.productName,
                    quantity: item.quantity,
                    price: item.price
                }))
            });
            return response.data;
        },
        onSuccess: (orderId) => {
            localStorage.removeItem('cart');
            setCartItems([]);
            alert(`Order created successfully! Order ID: ${orderId}`);
        },
        onError: (error) => {
            console.error('Error creating order:', error);
            alert('Failed to create order. Please try again.');
        }
    });

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>

            {cartItems.length === 0 ? (
                <p>Your cart is empty</p>
            ) : (
                <>
                    <div className="space-y-4">
                        {cartItems.map((item) => (
                            <div key={item.productId} className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-medium">{item.productName}</h3>
                                    <p className="text-gray-500">Quantity: {item.quantity}</p>
                                </div>
                                <p className="text-lg font-medium">${item.price * item.quantity}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 pt-6 border-t">
                        <div className="flex justify-between text-xl font-bold">
                            <p>Total</p>
                            <p>${total.toFixed(2)}</p>
                        </div>

                        <button
                            onClick={() => createOrder.mutate(cartItems)}
                            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                            disabled={createOrder.isPending}
                        >
                            {createOrder.isPending ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}
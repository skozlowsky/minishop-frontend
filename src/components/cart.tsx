import { useMutation } from '@tanstack/react-query';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { apiClient } from '../lib/api-client';
import { useCart } from '../hooks/useCart';

export function Cart() {
    const { items, updateQuantity, removeItem, total, clearCart } = useCart();

    const createOrder = useMutation({
        mutationFn: async () => {
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
            clearCart();
            alert(`Order created successfully! Order ID: ${orderId}`);
        },
        onError: (error) => {
            console.error('Error creating order:', error);
            alert('Failed to create order. Please try again.');
        }
    });

    if (items.length === 0) {
        return (
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow p-6 text-center">
                    <h2 className="text-2xl font-bold mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-600 mb-4">Add some products to your cart to get started!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6">
                    <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>

                    <div className="divide-y divide-gray-200">
                        {items.map((item) => (
                            <div key={item.productId} className="py-6 flex">
                                {/* Product Image Placeholder */}
                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100 flex items-center justify-center">
                                    <span className="text-gray-400 text-sm">Product Image</span>
                                </div>

                                <div className="ml-4 flex flex-1 flex-col">
                                    <div className="flex justify-between">
                                        <div>
                                            <h3 className="text-base font-medium text-gray-900">
                                                {item.productName}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                ${item.price.toFixed(2)} each
                                            </p>
                                        </div>
                                        <p className="text-base font-medium text-gray-900">
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => removeItem(item.productId)}
                                                className="text-red-600 hover:text-red-700 p-1 rounded-md hover:bg-red-50"
                                                title="Remove item"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>

                                            <div className="flex items-center border rounded-md">
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-transparent"
                                                    title="Decrease quantity"
                                                >
                                                    <Minus className="h-4 w-4" />
                                                </button>
                                                <span className="px-4 py-2 text-center min-w-[3rem]">
                          {item.quantity}
                        </span>
                                                <button
                                                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                                                    className="p-2 hover:bg-gray-100"
                                                    title="Increase quantity"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                    <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                        <p>Subtotal</p>
                        <p>${total.toFixed(2)}</p>
                    </div>

                    <div className="flex justify-between space-x-4">
                        <button
                            onClick={() => clearCart()}
                            className="flex-1 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Clear Cart
                        </button>
                        <button
                            onClick={() => createOrder.mutate()}
                            disabled={createOrder.isPending}
                            className="flex-1 rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300"
                        >
                            {createOrder.isPending ? 'Processing...' : 'Checkout'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
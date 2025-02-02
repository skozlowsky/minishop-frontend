import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';

interface Product {
    id: string;
    name: string;
    price: number;
    categoryName: string;
}

interface PagedResult {
    items: Product[];
    totalCount: number;
    page: number;
    pageSize: number;
    hasNextPage: boolean;
}

export function ProductList() {
    const [page] = useState(1);

    const { data, isLoading } = useQuery<PagedResult>({
        queryKey: ['products', page],
        queryFn: async () => {
            const response = await apiClient.get(`/api/products?Page=${page}&PageSize=20`);
            return response.data;
        }
    });

    const addToCart = async (productId: string) => {
        try {
            const product = data?.items.find(p => p.id === productId);
            if (!product) return;

            const cartItems = JSON.parse(localStorage.getItem('cart') || '[]');
            cartItems.push({
                productId,
                productName: product.name,
                quantity: 1,
                price: product.price
            });
            localStorage.setItem('cart', JSON.stringify(cartItems));
            alert('Added to cart!');
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data?.items.map((product) => (
                <div key={product.id} className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                    <p className="mt-2 text-sm text-gray-500">{product.categoryName}</p>
                    <p className="mt-2 text-lg font-medium text-gray-900">${product.price}</p>
                    <button
                        onClick={() => addToCart(product.id)}
                        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
                    >
                        Add to Cart
                    </button>
                </div>
            ))}
        </div>
    );
}
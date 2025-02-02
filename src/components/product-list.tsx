import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../lib/api-client';
import {ShoppingCart} from "lucide-react";
import {Sidebar} from "./sidebar.tsx";

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
    const [page, setPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<string>();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const { data, isLoading } = useQuery<PagedResult>({
        queryKey: ['products', page, selectedCategory],
        queryFn: async () => {
            const endpoint = selectedCategory
                ? `/api/categories/${selectedCategory}/products`
                : '/api/products';
            const response = await apiClient.get(`${endpoint}?Page=${page}&PageSize=20`);
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

    return (
        <div className="flex">
            <Sidebar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            <div className="flex-1">
                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {data?.items.map((product) => (
                                <div
                                    key={product.id}
                                    className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow"
                                >
                                    {/* Product image placeholder */}
                                    <div className="h-48 bg-gray-100 flex items-center justify-center">
                                        <div className="text-gray-400">
                                            Product Image
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {product.name}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {product.categoryName}
                                        </p>
                                        <div className="mt-4 flex items-center justify-between">
                                            <p className="text-lg font-medium text-gray-900">
                                                ${product.price.toFixed(2)}
                                            </p>
                                            <button
                                                onClick={() => addToCart(product.id)}
                                                className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                            >
                                                <ShoppingCart className="h-4 w-4" />
                                                <span>Add to Cart</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {data && data.totalCount > 0 && (
                            <div className="mt-8 flex justify-center">
                                <nav className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-3 py-2 rounded-md border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-4 py-2 text-sm text-gray-700">
                    Page {page} of {Math.ceil(data.totalCount / data.pageSize)}
                  </span>
                                    <button
                                        onClick={() => setPage(p => p + 1)}
                                        disabled={!data.hasNextPage}
                                        className="px-3 py-2 rounded-md border text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </nav>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
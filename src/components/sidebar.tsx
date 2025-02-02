import { useQuery } from '@tanstack/react-query';
import { Menu, X } from 'lucide-react';
import { apiClient } from '../lib/api-client';
import type { Category } from '../types/api';

interface SidebarProps {
    selectedCategory?: string;
    onSelectCategory: (categoryId?: string) => void;
    isMobileOpen: boolean;
    setIsMobileOpen: (isOpen: boolean) => void;
}

export function Sidebar({
                            selectedCategory,
                            onSelectCategory,
                            isMobileOpen,
                            setIsMobileOpen
                        }: SidebarProps) {
    const { data: categories } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: async () => {
            const response = await apiClient.get('/api/categories');
            return response.data;
        }
    });

    const sidebarContent = (
        <div className="h-full">
            <div className="flex items-center justify-between px-4 py-3 lg:hidden">
                <h2 className="text-lg font-semibold">Categories</h2>
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="p-2 rounded-md hover:bg-gray-100"
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <nav className="px-2 py-4">
                <button
                    onClick={() => {
                        onSelectCategory(undefined);
                        setIsMobileOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium 
            ${!selectedCategory
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                    All Products
                </button>

                <div className="mt-4 space-y-1">
                    {categories?.map((category) => (
                        <button
                            key={category.id}
                            onClick={() => {
                                onSelectCategory(category.id);
                                setIsMobileOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium
                ${selectedCategory === category.id
                                ? 'bg-blue-100 text-blue-900'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                        >
                            {category.name}
                            <span className="ml-2 text-xs text-gray-500">
                ({category.productCount})
              </span>
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );

    return (
        <>
            {/* Mobile menu button */}
            <div className="lg:hidden">
                <button
                    onClick={() => setIsMobileOpen(true)}
                    className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
                >
                    <Menu className="h-6 w-6" />
                </button>
            </div>

            {/* Mobile sidebar */}
            <div
                className={`fixed inset-0 z-40 lg:hidden ${
                    isMobileOpen ? 'block' : 'hidden'
                }`}
            >
                <div className="fixed inset-0 bg-black/30" onClick={() => setIsMobileOpen(false)} />
                <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg">
                    {sidebarContent}
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:block lg:w-64 lg:mr-8">
                {sidebarContent}
            </div>
        </>
    );
}

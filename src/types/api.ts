export interface Product {
    id: string;
    name: string;
    price: number;
    categoryName: string;
}

export interface ProductDetails extends Product {
    description: string;
    categoryId: string;
    stockQuantity: number;
    isAvailable: boolean;
}

export interface Category {
    id: string;
    name: string;
    description: string;
    productCount: number;
}

export interface PagedResult<T> {
    items: T[];
    totalCount: number;
    page: number;
    pageSize: number;
    hasNextPage: boolean;
}

export interface OrderItem {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
}

export interface CreateOrderCommand {
    items: OrderItem[];
}
